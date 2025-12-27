"""
Authentication Routes - Updated for Dual Voting (MLA + MP)
Privacy-Preserving Quantum Voting System
"""

import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from models.database import SessionLocal, VoterSession, Constituency, District

router = APIRouter(prefix="/auth", tags=["Authentication"])


class SessionCreateRequest(BaseModel):
    """Request to create a new voter session"""
    district: str  # Voter's district for constituency mapping


class SessionCreateResponse(BaseModel):
    """Response with session details"""
    session_id: str
    district: str
    mla_constituencies: list
    mp_constituencies: list
    expires_at: str
    message: str


class DualConstituencySelectRequest(BaseModel):
    """Request to select both MLA and MP constituencies"""
    session_id: str
    mla_constituency_id: int
    mp_constituency_id: int


@router.get("/districts")
async def get_districts():
    """Get all districts for voter selection"""
    db = SessionLocal()
    try:
        districts = db.query(District).all()
        if not districts:
            # Return hardcoded list if table is empty
            return {
                "districts": [
                    "Srikakulam", "Vizianagaram", "Visakhapatnam", "East Godavari",
                    "West Godavari", "Krishna", "Guntur", "Prakasam", "Nellore",
                    "Kadapa", "Kurnool", "Anantapur", "Chittoor"
                ]
            }
        return {
            "districts": [
                {
                    "name": d.name,
                    "lat": d.lat,
                    "lng": d.lng,
                    "mla_count": d.mla_count,
                    "mp_count": d.mp_count
                }
                for d in districts
            ]
        }
    finally:
        db.close()


@router.post("/session/create", response_model=SessionCreateResponse)
async def create_voter_session(request: SessionCreateRequest):
    """
    Create a new anonymous voter session for dual voting (MLA + MP).
    """
    db = SessionLocal()
    try:
        # Generate unique session ID
        session_id = secrets.token_hex(32)
        expires_at = datetime.utcnow() + timedelta(hours=2)  # Longer for dual voting
        
        # Get constituencies for this district
        mla_constituencies = db.query(Constituency).filter(
            Constituency.district == request.district,
            Constituency.election_type == 'MLA'
        ).all()
        
        mp_constituencies = db.query(Constituency).filter(
            Constituency.district == request.district,
            Constituency.election_type == 'MP'
        ).all()
        
        # If no constituencies found for this district, get nearby
        if not mla_constituencies:
            mla_constituencies = db.query(Constituency).filter(
                Constituency.election_type == 'MLA'
            ).limit(5).all()
        
        if not mp_constituencies:
            mp_constituencies = db.query(Constituency).filter(
                Constituency.election_type == 'MP'
            ).limit(3).all()
        
        # Create session
        session = VoterSession(
            session_id=session_id,
            district=request.district,
            has_voted_mla=False,
            has_voted_mp=False,
            created_at=datetime.utcnow(),
            expires_at=expires_at
        )
        db.add(session)
        db.commit()
        
        return SessionCreateResponse(
            session_id=session_id,
            district=request.district,
            mla_constituencies=[
                {"id": c.id, "name": c.name, "district": c.district}
                for c in mla_constituencies
            ],
            mp_constituencies=[
                {"id": c.id, "name": c.name, "district": c.district}
                for c in mp_constituencies
            ],
            expires_at=expires_at.isoformat(),
            message="Session created. You can vote for both MLA and MP in this session."
        )
    finally:
        db.close()


@router.post("/session/select-constituencies")
async def select_dual_constituencies(request: DualConstituencySelectRequest):
    """
    Select both MLA and MP constituencies for dual voting.
    """
    db = SessionLocal()
    try:
        # Validate session
        session = db.query(VoterSession).filter(
            VoterSession.session_id == request.session_id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if session.has_voted_mla and session.has_voted_mp:
            raise HTTPException(status_code=400, detail="This session has already completed voting")
        
        if session.expires_at and session.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Session has expired")
        
        # Validate MLA constituency
        mla_constituency = db.query(Constituency).filter(
            Constituency.id == request.mla_constituency_id,
            Constituency.election_type == 'MLA'
        ).first()
        
        if not mla_constituency:
            raise HTTPException(status_code=404, detail="MLA constituency not found")
        
        # Validate MP constituency
        mp_constituency = db.query(Constituency).filter(
            Constituency.id == request.mp_constituency_id,
            Constituency.election_type == 'MP'
        ).first()
        
        if not mp_constituency:
            raise HTTPException(status_code=404, detail="MP constituency not found")
        
        # Update session
        session.mla_constituency_id = request.mla_constituency_id
        session.mp_constituency_id = request.mp_constituency_id
        db.commit()
        
        return {
            "success": True,
            "message": "Both constituencies selected successfully",
            "mla_constituency": {
                "id": mla_constituency.id,
                "name": mla_constituency.name,
                "district": mla_constituency.district
            },
            "mp_constituency": {
                "id": mp_constituency.id,
                "name": mp_constituency.name,
                "district": mp_constituency.district
            }
        }
    finally:
        db.close()


@router.post("/quantum/generate-key")
async def generate_quantum_key(session_id: str, simulate_attack: bool = False):
    """
    Generate a quantum key for the voter session using BB84 protocol.
    """
    from quantum.qkd import quantum_key_manager
    from models.database import QuantumChannelLog
    
    db = SessionLocal()
    try:
        # Validate session
        session = db.query(VoterSession).filter(
            VoterSession.session_id == session_id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if session.has_voted_mla and session.has_voted_mp:
            raise HTTPException(status_code=400, detail="This session has already completed voting")
        
        if not session.mla_constituency_id or not session.mp_constituency_id:
            raise HTTPException(status_code=400, detail="Please select both constituencies first")
        
        # Generate quantum key
        result = quantum_key_manager.generate_session_key(
            session_id=session_id,
            simulate_attack=simulate_attack
        )
        
        if result["channel_secure"]:
            session.quantum_key = result["shared_key"]
            db.commit()
            message = "Quantum key generated successfully. Channel is secure."
        else:
            message = "⚠️ Eavesdropping detected! Please try again."
        
        # Log quantum channel status
        log = QuantumChannelLog(
            session_id=session_id,
            error_rate=f"{result['error_rate']:.2%}",
            eavesdropping_detected=result["eavesdropping_detected"],
            channel_secure=result["channel_secure"]
        )
        db.add(log)
        db.commit()
        
        return {
            "session_id": session_id,
            "channel_secure": result["channel_secure"],
            "error_rate": result["error_rate"],
            "eavesdropping_detected": result["eavesdropping_detected"],
            "protocol_steps": result["protocol_steps"],
            "message": message
        }
    finally:
        db.close()


@router.get("/session/{session_id}/status")
async def get_session_status(session_id: str):
    """Get current status of a voter session including voting progress"""
    db = SessionLocal()
    try:
        session = db.query(VoterSession).filter(
            VoterSession.session_id == session_id
        ).first()
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        mla_const = None
        mp_const = None
        
        if session.mla_constituency_id:
            const = db.query(Constituency).filter(
                Constituency.id == session.mla_constituency_id
            ).first()
            if const:
                mla_const = {"id": const.id, "name": const.name, "district": const.district}
        
        if session.mp_constituency_id:
            const = db.query(Constituency).filter(
                Constituency.id == session.mp_constituency_id
            ).first()
            if const:
                mp_const = {"id": const.id, "name": const.name, "district": const.district}
        
        return {
            "session_id": session_id,
            "district": session.district,
            "has_voted_mla": session.has_voted_mla,
            "has_voted_mp": session.has_voted_mp,
            "voting_complete": session.has_voted_mla and session.has_voted_mp,
            "has_quantum_key": session.quantum_key is not None,
            "mla_constituency": mla_const,
            "mp_constituency": mp_const,
            "expires_at": session.expires_at.isoformat() if session.expires_at else None,
            "is_valid": not (session.has_voted_mla and session.has_voted_mp) and (
                session.expires_at is None or session.expires_at > datetime.utcnow()
            )
        }
    finally:
        db.close()


@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a voter session"""
    from quantum.qkd import quantum_key_manager
    
    db = SessionLocal()
    try:
        session = db.query(VoterSession).filter(
            VoterSession.session_id == session_id
        ).first()
        
        if session:
            db.delete(session)
            db.commit()
            quantum_key_manager.invalidate_session(session_id)
        
        return {"success": True, "message": "Session terminated"}
    finally:
        db.close()
