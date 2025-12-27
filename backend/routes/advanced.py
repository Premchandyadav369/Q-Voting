"""
Advanced Routes for Hackathon Features
- Attack Simulation API
- Blockchain Audit Trail
- Advanced Analytics
- Multi-language Support
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from quantum.analytics import attack_simulator, audit_trail, voting_analytics
from utils.ai import gemini_client

router = APIRouter(prefix="/advanced", tags=["Advanced Features"])


class AttackSimulationRequest(BaseModel):
    """Request to simulate an attack"""
    attack_type: str
    parameters: Optional[dict] = {}


class AuditActionRequest(BaseModel):
    """Request to add an audit action"""
    action: str
    description: str


# ==================== Attack Simulation ====================

@router.get("/attacks/types")
async def get_attack_types():
    """Get all available attack types for simulation"""
    return {
        "attack_types": attack_simulator.ATTACK_TYPES,
        "description": "These are simulated attacks for educational purposes. The system demonstrates how quantum cryptography detects and prevents each attack type."
    }


@router.post("/attacks/simulate")
async def simulate_attack(request: AttackSimulationRequest):
    """
    Simulate a quantum/classical attack on the voting system.
    Shows how the system detects and blocks attacks.
    """
    attack_type = request.attack_type
    params = request.parameters or {}
    
    if attack_type == "eve_intercept":
        intercept_rate = params.get("intercept_rate", 0.3)
        result = attack_simulator.simulate_eve_intercept(intercept_rate)
    elif attack_type == "photon_number_split":
        multi_photon_rate = params.get("multi_photon_rate", 0.1)
        result = attack_simulator.simulate_pns_attack(multi_photon_rate)
    elif attack_type == "replay":
        result = attack_simulator.simulate_replay_attack()
    else:
        raise HTTPException(status_code=400, detail=f"Unknown attack type: {attack_type}")
    
    # Log to audit trail
    audit_trail.add_action("ATTACK_SIMULATION", {
        "attack_type": attack_type,
        "detected": result.detected,
        "blocked": not result.success
    })
    
    return {
        "attack_id": result.attack_id,
        "attack_type": result.attack_type,
        "attack_name": attack_simulator.ATTACK_TYPES.get(attack_type, "Unknown"),
        "timestamp": result.timestamp.isoformat(),
        "result": {
            "attack_successful": result.success,
            "detected_by_system": result.detected,
            "error_rate": f"{result.error_rate:.2%}",
            "details": result.details
        },
        "security_status": "BLOCKED" if not result.success else "COMPROMISED"
    }


@router.get("/attacks/history")
async def get_attack_history():
    """Get history of all simulated attacks"""
    return attack_simulator.get_attack_summary()


# ==================== Blockchain Audit Trail ====================

@router.get("/audit/chain")
async def get_audit_chain():
    """Get the blockchain audit trail"""
    verification = audit_trail.verify_chain()
    entries = audit_trail.get_audit_log(limit=50)
    
    return {
        "chain_status": verification,
        "total_blocks": len(audit_trail.chain),
        "latest_entries": entries
    }


@router.get("/audit/verify")
async def verify_audit_chain():
    """Verify the integrity of the entire audit chain"""
    result = audit_trail.verify_chain()
    
    if result["valid"]:
        return {
            "status": "VERIFIED",
            "message": "Audit chain integrity verified. No tampering detected.",
            **result
        }
    else:
        return {
            "status": "TAMPERED",
            "message": "WARNING: Audit chain integrity compromised!",
            **result
        }


@router.post("/audit/log")
async def add_audit_entry(request: AuditActionRequest):
    """Add a manual audit entry (for demonstration)"""
    entry = audit_trail.add_action(request.action, {
        "description": request.description,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {
        "success": True,
        "block_id": entry.block_id,
        "timestamp": entry.timestamp.isoformat()
    }


# ==================== Advanced Analytics ====================

@router.get("/analytics/realtime")
async def get_realtime_analytics():
    """Get real-time voting analytics"""
    from models.database import SessionLocal, Vote, Constituency
    
    db = SessionLocal()
    try:
        # Get total votes
        total_votes = db.query(Vote).count()
        
        # Get votes by district
        district_votes = {}
        votes = db.query(Vote).join(Constituency).all()
        for vote in votes:
            district = vote.constituency.district
            district_votes[district] = district_votes.get(district, 0) + 1
            voting_analytics.record_vote(district, vote.timestamp)
        
        # Calculate time-based metrics
        now = datetime.utcnow()
        election_start = now.replace(hour=7, minute=0, second=0, microsecond=0)
        elapsed_hours = max(0.1, (now - election_start).total_seconds() / 3600)
        
        turnout_prediction = voting_analytics.predict_turnout(
            current_votes=total_votes,
            elapsed_hours=elapsed_hours
        )
        
        return {
            "timestamp": now.isoformat(),
            "total_votes": total_votes,
            "district_participation": district_votes,
            "hourly_trend": voting_analytics.get_hourly_trend(),
            "turnout_prediction": turnout_prediction,
            "top_districts": sorted(
                district_votes.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
        }
    finally:
        db.close()


@router.get("/analytics/heatmap")
async def get_district_heatmap():
    """Get district-wise data for heatmap visualization"""
    from models.database import SessionLocal, Vote, Constituency
    
    db = SessionLocal()
    try:
        district_votes = {}
        votes = db.query(Vote).join(Constituency).all()
        for vote in votes:
            district = vote.constituency.district
            district_votes[district] = district_votes.get(district, 0) + 1
        
        # All AP districts
        all_districts = [
            "Srikakulam", "Vizianagaram", "Visakhapatnam", "East Godavari",
            "West Godavari", "Krishna", "Guntur", "Prakasam", "Nellore",
            "Kadapa", "Kurnool", "Anantapur", "Chittoor"
        ]
        
        heatmap_data = []
        max_votes = max(district_votes.values()) if district_votes else 1
        
        for district in all_districts:
            votes_count = district_votes.get(district, 0)
            heatmap_data.append({
                "district": district,
                "votes": votes_count,
                "intensity": round(votes_count / max_votes, 2) if max_votes > 0 else 0
            })
        
        return {
            "heatmap": heatmap_data,
            "max_votes": max_votes,
            "total_districts": len(all_districts)
        }
    finally:
        db.close()


@router.get("/analytics/ai-insights")
async def get_ai_insights():
    """Generate dynamic AI insights based on current results"""
    from routes.results import get_dashboard_summary
    
    # Get current summary data
    summary = await get_dashboard_summary()
    
    # Generate insights
    insights = await gemini_client.generate_insights(summary)
    
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "insights": insights
    }


# ==================== Multi-Language Support ====================

TRANSLATIONS = {
    "en": {
        "title": "Q-Voting",
        "subtitle": "Privacy-Preserving Quantum Voting Simulation",
        "start_voting": "Start Voting",
        "admin_dashboard": "Admin Dashboard",
        "select_constituency": "Select Constituency",
        "cast_vote": "Cast Vote",
        "vote_recorded": "Your vote has been securely recorded",
        "quantum_secure": "Quantum Secure",
        "anonymous": "Anonymous",
        "disclaimer": "This is an academic simulation only",
        "dashboard_title": "Real-Time Election Dashboard",
        "dashboard_subtitle": "Live voting data from Andhra Pradesh",
        "loading_dashboard": "Loading real-time dashboard...",
        "live": "LIVE",
        "paused": "PAUSED",
        "election_insights": "Election Insights",
        "total_votes": "Total Votes",
        "votes": "Votes",
        "constituencies": "constituencies",
        "quantum_security": "Quantum Security",
        "party_standing": "Party-wise Standing",
        "no_votes_yet": "No votes yet",
        "mla_election": "MLA Election",
        "mp_election": "MP Election",
        "loading": "Loading..."
    },
    "te": {
        "title": "క్వాంటం ఓటింగ్ వ్యవస్థ",
        "subtitle": "గోప్యత-పరిరక్షణ క్వాంటం ఓటింగ్ అనుకరణ",
        "start_voting": "ఓటింగ్ ప్రారంభించండి",
        "admin_dashboard": "అడ్మిన్ డాష్‌బోర్డ్",
        "select_constituency": "నియోజకవర్గాన్ని ఎంచుకోండి",
        "cast_vote": "ఓటు వేయండి",
        "vote_recorded": "మీ ఓటు సురక్షితంగా నమోదు చేయబడింది",
        "quantum_secure": "క్వాంటం సురక్షితం",
        "anonymous": "అనామకం",
        "disclaimer": "ఇది అకాడమిక్ అనుకరణ మాత్రమే",
        "dashboard_title": "రియల్-టైమ్ ఎన్నికల డాష్‌బోర్డ్",
        "dashboard_subtitle": "ఆంధ్రప్రదేశ్ నుండి లైవ్ ఓటింగ్ డేటా",
        "loading_dashboard": "రియల్ టైమ్ డాష్‌బోర్డ్‌ను లోడ్ చేస్తోంది...",
        "live": "లైవ్",
        "paused": "నిలిపివేయబడింది",
        "election_insights": "ఎన్నికల అంతర్దృష్టులు",
        "total_votes": "మొత్తం ఓట్లు",
        "votes": "ఓట్లు",
        "constituencies": "నియోజకవర్గాలు",
        "quantum_security": "క్వాంటం భద్రత",
        "party_standing": "పార్టీల వారీ స్థితి",
        "no_votes_yet": "ఇంకా ఓట్లు లేవు",
        "mla_election": "ఎమ్మెల్యే ఎన్నికలు",
        "mp_election": "ఎంపీ ఎన్నికలు",
        "loading": "లోడ్ అవుతోంది..."
    },
    "hi": {
        "title": "क्वांटम वोटिंग सिस्टम",
        "subtitle": "गोपनीयता-संरक्षण क्वांटम वोटिंग सिमुलेशन",
        "start_voting": "वोटिंग शुरू करें",
        "admin_dashboard": "एडमिन डैशबोर्ड",
        "select_constituency": "निर्वाचन क्षेत्र चुनें",
        "cast_vote": "वोट दें",
        "vote_recorded": "आपका वोट सुरक्षित रूप से दर्ज हो गया",
        "quantum_secure": "क्वांटम सुरक्षित",
        "anonymous": "गुमनाम",
        "disclaimer": "यह केवल एक शैक्षिक सिमुलेशन है",
        "dashboard_title": "रियल-टाइम चुनाव डैशबोर्ड",
        "dashboard_subtitle": "आंध्र प्रदेश से लाइव वोटिंग डेटा",
        "loading_dashboard": "रियल-टाइम डैशबोर्ड लोड हो रहा है...",
        "live": "लाइव",
        "paused": "रुका हुआ",
        "election_insights": "चुनाव अंतर्दृष्टि",
        "total_votes": "कुल वोट",
        "votes": "वोट",
        "constituencies": "निर्वाचन क्षेत्र",
        "quantum_security": "क्वांटम सुरक्षा",
        "party_standing": "पार्टी-वार स्थिति",
        "no_votes_yet": "अभी तक कोई वोट नहीं",
        "mla_election": "एमएलए चुनाव",
        "mp_election": "एमपी चुनाव",
        "loading": "लोड हो रहा है..."
    }
}


@router.get("/i18n/{language}")
async def get_translations(language: str):
    """Get UI translations for a language"""
    if language not in TRANSLATIONS:
        raise HTTPException(status_code=404, detail=f"Language '{language}' not supported")
    
    return {
        "language": language,
        "translations": TRANSLATIONS[language],
        "available_languages": list(TRANSLATIONS.keys())
    }


@router.get("/i18n")
async def get_available_languages():
    """Get list of available languages"""
    return {
        "languages": [
            {"code": "en", "name": "English", "native": "English"},
            {"code": "te", "name": "Telugu", "native": "తెలుగు"},
            {"code": "hi", "name": "Hindi", "native": "हिंदी"}
        ],
        "default": "en"
    }


# ==================== System Health & Metrics ====================

@router.get("/health/detailed")
async def get_detailed_health():
    """Get detailed system health status"""
    from models.database import SessionLocal, Vote, VoterSession, QuantumChannelLog
    
    db = SessionLocal()
    try:
        # Database health
        total_votes = db.query(Vote).count()
        active_sessions = db.query(VoterSession).filter(VoterSession.has_voted == False).count()
        quantum_logs = db.query(QuantumChannelLog).count()
        
        # Audit chain health
        audit_status = audit_trail.verify_chain()
        
        # Attack simulation summary
        attack_summary = attack_simulator.get_attack_summary()
        
        return {
            "status": "OPERATIONAL",
            "timestamp": datetime.utcnow().isoformat(),
            "components": {
                "database": {
                    "status": "UP",
                    "metrics": {
                        "total_votes": total_votes,
                        "active_sessions": active_sessions,
                        "quantum_logs": quantum_logs
                    }
                },
                "quantum_module": {
                    "status": "UP",
                    "protocol": "BB84",
                    "encryption": "AES-256-GCM"
                },
                "audit_chain": {
                    "status": "VERIFIED" if audit_status["valid"] else "ALERT",
                    "blocks": audit_status["blocks_verified"]
                },
                "attack_defense": {
                    "total_simulations": attack_summary["total_attacks"],
                    "detection_rate": f"{attack_summary['detection_rate']}%"
                }
            },
            "uptime": "100%",
            "version": "1.0.0"
        }
    finally:
        db.close()
