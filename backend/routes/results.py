"""
Results Routes
Privacy-Preserving Quantum Voting System

Handles result aggregation and admin dashboard data.
Only aggregate results are shown - no individual voter data.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException
from sqlalchemy import func

from models.database import (
    SessionLocal, Constituency, Candidate, Vote, QuantumChannelLog,
    get_vote_counts_by_constituency, get_party_wise_results
)

router = APIRouter(prefix="/results", tags=["Results"])


@router.get("/constituency/{constituency_id}")
async def get_constituency_results(constituency_id: int):
    """
    Get vote results for a specific constituency.
    Shows candidate-wise vote counts only.
    """
    db = SessionLocal()
    try:
        constituency = db.query(Constituency).filter(
            Constituency.id == constituency_id
        ).first()
        
        if not constituency:
            raise HTTPException(status_code=404, detail="Constituency not found")
        
        results = get_vote_counts_by_constituency(constituency_id)
        
        # Calculate total and percentages
        total_votes = sum(r['votes'] for r in results)
        
        for r in results:
            r['percentage'] = round((r['votes'] / max(total_votes, 1)) * 100, 2)
        
        # Sort by votes descending
        results.sort(key=lambda x: x['votes'], reverse=True)
        
        return {
            "constituency": {
                "id": constituency.id,
                "name": constituency.name,
                "district": constituency.district,
                "election_type": constituency.election_type
            },
            "total_votes": total_votes,
            "results": results,
            "winner": results[0] if results and results[0]['votes'] > 0 else None
        }
    finally:
        db.close()


@router.get("/party-wise/{election_type}")
async def get_party_wise(election_type: str):
    """
    Get party-wise aggregated results for an election type.
    
    Args:
        election_type: 'MLA' or 'MP'
    """
    if election_type not in ['MLA', 'MP']:
        raise HTTPException(status_code=400, detail="Election type must be 'MLA' or 'MP'")
    
    results = get_party_wise_results(election_type)
    total_votes = sum(r['votes'] for r in results)
    
    for r in results:
        r['percentage'] = round((r['votes'] / max(total_votes, 1)) * 100, 2)
    
    return {
        "election_type": election_type,
        "total_votes": total_votes,
        "party_results": results
    }


@router.get("/all/{election_type}")
async def get_all_results(election_type: str):
    """
    Get results for all constituencies of an election type.
    """
    if election_type not in ['MLA', 'MP']:
        raise HTTPException(status_code=400, detail="Election type must be 'MLA' or 'MP'")
    
    db = SessionLocal()
    try:
        constituencies = db.query(Constituency).filter(
            Constituency.election_type == election_type
        ).all()
        
        all_results = []
        party_totals = {}
        
        for const in constituencies:
            results = get_vote_counts_by_constituency(const.id)
            total_votes = sum(r['votes'] for r in results)
            
            # Find winner
            winner = None
            if results:
                results.sort(key=lambda x: x['votes'], reverse=True)
                if results[0]['votes'] > 0:
                    winner = results[0]
                    
                    # Track party totals
                    party = winner['party']
                    if party not in party_totals:
                        party_totals[party] = {'seats': 0, 'votes': 0}
                    party_totals[party]['seats'] += 1
                    party_totals[party]['votes'] += winner['votes']
            
            all_results.append({
                "constituency_id": const.id,
                "constituency_name": const.name,
                "district": const.district,
                "total_votes": total_votes,
                "winner": winner
            })
        
        # Convert party totals to list
        party_summary = [
            {"party": party, "seats": data['seats'], "votes": data['votes']}
            for party, data in party_totals.items()
        ]
        party_summary.sort(key=lambda x: x['seats'], reverse=True)
        
        return {
            "election_type": election_type,
            "total_constituencies": len(constituencies),
            "constituencies_with_votes": len([r for r in all_results if r['total_votes'] > 0]),
            "constituency_results": all_results,
            "party_summary": party_summary
        }
    finally:
        db.close()


@router.get("/district/{district_name}")
async def get_district_results(district_name: str, election_type: str = 'MLA'):
    """
    Get constituency-level results for a specific district.
    Used for map drill-down.
    """
    from models.database import get_district_constituencies_results
    
    results = get_district_constituencies_results(district_name, election_type)
    
    return {
        "district": district_name,
        "election_type": election_type,
        "constituencies_count": len(results),
        "results": results
    }


@router.get("/quantum/channel-health")
async def get_quantum_channel_health():
    """
    Get quantum channel health statistics.
    Shows aggregated security metrics.
    """
    db = SessionLocal()
    try:
        total_sessions = db.query(QuantumChannelLog).count()
        secure_sessions = db.query(QuantumChannelLog).filter(
            QuantumChannelLog.channel_secure == True
        ).count()
        
        eavesdropping_detected = db.query(QuantumChannelLog).filter(
            QuantumChannelLog.eavesdropping_detected == True
        ).count()
        
        # Get last 10 channel statuses
        recent_logs = db.query(QuantumChannelLog).order_by(
            QuantumChannelLog.timestamp.desc()
        ).limit(10).all()
        
        recent_status = [
            {
                "timestamp": log.timestamp.isoformat(),
                "error_rate": log.error_rate,
                "secure": log.channel_secure,
                "eavesdropping": log.eavesdropping_detected
            }
            for log in recent_logs
        ]
        
        return {
            "total_quantum_sessions": total_sessions,
            "secure_sessions": secure_sessions,
            "compromised_sessions": total_sessions - secure_sessions,
            "eavesdropping_attempts": eavesdropping_detected,
            "security_rate": round((secure_sessions / max(total_sessions, 1)) * 100, 2),
            "channel_status": "SECURE" if total_sessions == 0 or secure_sessions == total_sessions else "ALERT",
            "recent_activity": recent_status
        }
    finally:
        db.close()


@router.get("/export/{election_type}")
async def export_results(election_type: str, format: str = "json"):
    """
    Export results for download.
    Only aggregate data - no voter information.
    """
    if election_type not in ['MLA', 'MP']:
        raise HTTPException(status_code=400, detail="Election type must be 'MLA' or 'MP'")
    
    all_results = await get_all_results(election_type)
    party_results = await get_party_wise(election_type)
    
    export_data = {
        "export_timestamp": datetime.utcnow().isoformat(),
        "election_type": election_type,
        "disclaimer": "This is simulated data for academic and research purposes only.",
        "summary": {
            "total_constituencies": all_results["total_constituencies"],
            "constituencies_counted": all_results["constituencies_with_votes"],
            "party_standings": all_results["party_summary"]
        },
        "party_wise_votes": party_results["party_results"],
        "constituency_wise": all_results["constituency_results"]
    }
    
    if format == "csv":
        # Return CSV-compatible structure
        csv_rows = ["Constituency,District,Total Votes,Winner,Winner Party"]
        for r in all_results["constituency_results"]:
            winner_name = r['winner']['candidate_name'] if r['winner'] else "N/A"
            winner_party = r['winner']['party'] if r['winner'] else "N/A"
            csv_rows.append(f"{r['constituency_name']},{r['district']},{r['total_votes']},{winner_name},{winner_party}")
        
        return {
            "format": "csv",
            "content": "\n".join(csv_rows)
        }
    
    return export_data


@router.get("/dashboard/summary")
async def get_dashboard_summary():
    """
    Get summary data for admin dashboard.
    """
    db = SessionLocal()
    try:
        # Count totals
        total_constituencies = db.query(Constituency).count()
        total_candidates = db.query(Candidate).count()
        total_votes = db.query(Vote).count()
        
        # Get by election type
        mla_const = db.query(Constituency).filter(Constituency.election_type == 'MLA').count()
        mp_const = db.query(Constituency).filter(Constituency.election_type == 'MP').count()
        
        mla_votes = db.query(Vote).join(Constituency).filter(
            Constituency.election_type == 'MLA'
        ).count()
        mp_votes = db.query(Vote).join(Constituency).filter(
            Constituency.election_type == 'MP'
        ).count()
        
        # Quantum channel health
        channel_health = await get_quantum_channel_health()
        
        return {
            "overview": {
                "total_constituencies": total_constituencies,
                "total_candidates": total_candidates,
                "total_votes": total_votes
            },
            "mla_election": {
                "constituencies": mla_const,
                "votes_cast": mla_votes
            },
            "mp_election": {
                "constituencies": mp_const,
                "votes_cast": mp_votes
            },
            "quantum_security": {
                "status": channel_health["channel_status"],
                "security_rate": channel_health["security_rate"]
            },
            "last_updated": datetime.utcnow().isoformat()
        }
    finally:
        db.close()
