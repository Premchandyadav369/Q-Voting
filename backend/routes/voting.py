"""
Voting Routes - Updated for Dual Voting (MLA + MP)
Privacy-Preserving Quantum Voting System
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models.database import (
    SessionLocal, VoterSession, Constituency, Candidate, Vote,
    get_constituencies_by_type, get_candidates_by_constituency,
    get_district_vote_summary
)
from quantum.encryption import vote_encryption, anonymity_guard
from quantum.qkd import quantum_key_manager

router = APIRouter(prefix="/voting", tags=["Voting"])


class CastVoteRequest(BaseModel):
    """Request to cast a vote (MLA or MP)"""
    session_id: str
    candidate_id: int
    election_type: str  # 'MLA' or 'MP'


class VoteConfirmation(BaseModel):
    """Vote confirmation response"""
    success: bool
    election_type: str
    receipt_code: str
    message: str
    timestamp: str
    voting_complete: bool


@router.get("/constituencies/{election_type}")
async def get_constituencies(election_type: str):
    """Get all constituencies for an election type."""
    if election_type not in ['MLA', 'MP']:
        raise HTTPException(status_code=400, detail="Election type must be 'MLA' or 'MP'")
    
    constituencies = get_constituencies_by_type(election_type)
    
    # Group by district
    by_district = {}
    for c in constituencies:
        district = c['district']
        if district not in by_district:
            by_district[district] = []
        by_district[district].append(c)
    
    return {
        "election_type": election_type,
        "total": len(constituencies),
        "constituencies": constituencies,
        "by_district": by_district
    }


@router.get("/candidates/{constituency_id}")
async def get_candidates(constituency_id: int):
    """Get all candidates for a constituency with party colors and 2024 data."""
    db = SessionLocal()
    try:
        constituency = db.query(Constituency).filter(
            Constituency.id == constituency_id
        ).first()
        
        if not constituency:
            raise HTTPException(status_code=404, detail="Constituency not found")
        
        candidates = get_candidates_by_constituency(constituency_id)
        
        return {
            "constituency": {
                "id": constituency.id,
                "name": constituency.name,
                "district": constituency.district,
                "election_type": constituency.election_type
            },
            "candidates": candidates
        }
    finally:
        db.close()


@router.post("/cast", response_model=VoteConfirmation)
async def cast_vote(request: CastVoteRequest):
    """
    Cast a vote for either MLA or MP election.
    Supports dual voting - can vote for both in same session.
    """
    db = SessionLocal()
    try:
        # Validate session
        session = db.query(VoterSession).filter(
            VoterSession.session_id == request.session_id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if session.expires_at and session.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Session has expired")
        
        if not session.quantum_key:
            raise HTTPException(status_code=400, detail="Quantum key not generated")
        
        # Check if already voted for this election type
        if request.election_type == 'MLA':
            if session.has_voted_mla:
                raise HTTPException(status_code=400, detail="Already voted for MLA")
            expected_const_id = session.mla_constituency_id
        elif request.election_type == 'MP':
            if session.has_voted_mp:
                raise HTTPException(status_code=400, detail="Already voted for MP")
            expected_const_id = session.mp_constituency_id
        else:
            raise HTTPException(status_code=400, detail="Invalid election type")
        
        if not expected_const_id:
            raise HTTPException(status_code=400, detail=f"No {request.election_type} constituency selected")
        
        # Validate candidate
        candidate = db.query(Candidate).filter(
            Candidate.id == request.candidate_id,
            Candidate.constituency_id == expected_const_id
        ).first()
        
        if not candidate:
            raise HTTPException(status_code=400, detail="Invalid candidate for selected constituency")
        
        # Prepare and encrypt vote
        timestamp = datetime.utcnow()
        vote_data = {
            "constituency_id": expected_const_id,
            "candidate_id": request.candidate_id,
            "timestamp": timestamp.isoformat()
        }
        
        encrypted_result = vote_encryption.encrypt_vote(vote_data, session.quantum_key)
        
        # Check for duplicate
        existing_vote = db.query(Vote).filter(
            Vote.vote_hash == encrypted_result['vote_hash']
        ).first()
        
        if existing_vote:
            raise HTTPException(status_code=400, detail="Duplicate vote detected")
        
        # Store vote
        vote = Vote(
            constituency_id=expected_const_id,
            candidate_id=request.candidate_id,
            encrypted_vote=encrypted_result['encrypted_vote'],
            vote_hash=encrypted_result['vote_hash'],
            timestamp=timestamp
        )
        db.add(vote)
        
        # Update session
        if request.election_type == 'MLA':
            session.has_voted_mla = True
        else:
            session.has_voted_mp = True
        
        voting_complete = session.has_voted_mla and session.has_voted_mp
        
        # Clear quantum key only if both votes cast
        if voting_complete:
            session.quantum_key = None
            quantum_key_manager.invalidate_session(request.session_id)
        
        db.commit()
        
        receipt_code = anonymity_guard.generate_anonymous_receipt(encrypted_result['vote_hash'])
        
        return VoteConfirmation(
            success=True,
            election_type=request.election_type,
            receipt_code=receipt_code,
            message=f"Your {request.election_type} vote has been securely recorded.",
            timestamp=timestamp.isoformat(),
            voting_complete=voting_complete
        )
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error casting vote: {str(e)}")
    finally:
        db.close()


@router.get("/verify/{receipt_code}")
async def verify_vote(receipt_code: str):
    """Verify that a vote was recorded."""
    if not receipt_code.startswith("QV-") or len(receipt_code) != 16:
        return {"valid_format": False, "message": "Invalid receipt code format"}
    
    return {
        "valid_format": True,
        "message": "Receipt code format is valid. Individual votes cannot be looked up for privacy."
    }


@router.get("/stats/turnout")
async def get_turnout_stats():
    """Get voting turnout statistics"""
    db = SessionLocal()
    try:
        mla_votes = db.query(Vote).join(Constituency).filter(
            Constituency.election_type == 'MLA'
        ).count()
        
        mp_votes = db.query(Vote).join(Constituency).filter(
            Constituency.election_type == 'MP'
        ).count()
        
        return {
            "mla": {"total_votes": mla_votes},
            "mp": {"total_votes": mp_votes},
            "total_votes": mla_votes + mp_votes
        }
    finally:
        db.close()


@router.get("/realtime/district-map")
async def get_realtime_district_map():
    """Get real-time district-wise voting data for map visualization"""
    summary = get_district_vote_summary()
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "districts": summary,
        "color_legend": {
            "TDP": "#FFEB3B",
            "YSRCP": "#1565C0",
            "JSP": "#E53935",
            "BJP": "#FF9933",
            "INC": "#00BCD4",
            "IND": "#9E9E9E"
        }
    }
