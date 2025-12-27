"""
Database Models and Configuration - Updated for Real 2024 Data
Privacy-Preserving Quantum Voting System

Enhanced for:
- Dual voting (MLA + MP in single session)
- Real 2024 candidate data
- Party colors for visualization
- Real-time updates
"""

import json
import secrets
from datetime import datetime
from pathlib import Path
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Database setup
DATABASE_URL = "sqlite:///./quantum_voting.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Constituency(Base):
    """Constituency model for MLA and MP elections"""
    __tablename__ = "constituencies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    election_type = Column(String(10), nullable=False)  # 'MLA' or 'MP'
    district = Column(String(100), nullable=False)
    
    # Relationships
    candidates = relationship("Candidate", back_populates="constituency")
    votes = relationship("Vote", back_populates="constituency")


class Candidate(Base):
    """Candidate model with real 2024 data"""
    __tablename__ = "candidates"
    
    id = Column(Integer, primary_key=True, index=True)
    constituency_id = Column(Integer, ForeignKey("constituencies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    party = Column(String(100), nullable=False)
    party_short = Column(String(20), nullable=False)
    symbol = Column(String(10), nullable=True)
    party_color = Column(String(20), nullable=True)
    logo_url = Column(String(500), nullable=True)
    votes_2024 = Column(Integer, default=0)  # Actual 2024 election votes
    
    # Relationships
    constituency = relationship("Constituency", back_populates="candidates")
    votes = relationship("Vote", back_populates="candidate")


class Vote(Base):
    """Anonymous Vote model - no voter identification stored"""
    __tablename__ = "votes"
    
    id = Column(Integer, primary_key=True, index=True)
    constituency_id = Column(Integer, ForeignKey("constituencies.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    encrypted_vote = Column(Text, nullable=False)
    vote_hash = Column(String(64), unique=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    constituency = relationship("Constituency", back_populates="votes")
    candidate = relationship("Candidate", back_populates="votes")


class VoterSession(Base):
    """Voter session - supports dual voting (MLA + MP)"""
    __tablename__ = "voter_sessions"
    
    session_id = Column(String(64), primary_key=True)
    district = Column(String(100), nullable=True)  # Voter's district
    mla_constituency_id = Column(Integer, ForeignKey("constituencies.id"), nullable=True)
    mp_constituency_id = Column(Integer, ForeignKey("constituencies.id"), nullable=True)
    has_voted_mla = Column(Boolean, default=False)
    has_voted_mp = Column(Boolean, default=False)
    quantum_key = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)


class QuantumChannelLog(Base):
    """Log of quantum channel status for monitoring"""
    __tablename__ = "quantum_channel_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), nullable=False)
    error_rate = Column(String(10), nullable=False)
    eavesdropping_detected = Column(Boolean, default=False)
    channel_secure = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class District(Base):
    """District info for map visualization"""
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    mla_count = Column(Integer, default=0)
    mp_count = Column(Integer, default=0)
    total_votes = Column(Integer, default=0)
    leading_party = Column(String(20), nullable=True)
    leading_party_color = Column(String(20), nullable=True)


# Create all tables
def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def seed_database():
    """Seed database with real 2024 AP election data"""
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(Constituency).count() > 0:
            print("Database already seeded")
            return
        
        # Load data files
        data_path = Path(__file__).parent.parent / "data" / "constituencies.json"
        candidates_path = Path(__file__).parent.parent / "data" / "candidates.json"
        
        with open(data_path, 'r', encoding='utf-8') as f:
            constituency_data = json.load(f)
        
        with open(candidates_path, 'r', encoding='utf-8') as f:
            candidate_data = json.load(f)
        
        # Create party lookup
        parties = {p['short']: p for p in candidate_data['parties']}
        real_mla_candidates = candidate_data.get('mla_candidates_2024', {})
        real_mp_candidates = candidate_data.get('mp_candidates_2024', {})
        districts_info = candidate_data.get('districts', {})
        
        # Seed districts
        for district_name, info in districts_info.items():
            district = District(
                name=district_name,
                lat=info.get('lat'),
                lng=info.get('lng'),
                mla_count=info.get('mla_count', 0),
                mp_count=info.get('mp_count', 0)
            )
            db.add(district)
        
        # Seed MLA constituencies with real candidates where available
        for const in constituency_data['mla_constituencies']:
            constituency = Constituency(
                id=const['id'],
                name=const['name'],
                election_type='MLA',
                district=const['district']
            )
            db.add(constituency)
            db.flush()
            
            # Check if we have real candidate data for this constituency
            # If not, and we have API key, try to fetch some
            if const['name'] in real_mla_candidates:
                for cand in real_mla_candidates[const['name']]:
                    party = parties.get(cand['party'], parties['IND'])
                    candidate = Candidate(
                        constituency_id=constituency.id,
                        name=cand['name'],
                        party=party['name'],
                        party_short=cand['party'],
                        symbol=party['symbol'],
                        party_color=party.get('color', '#9E9E9E'),
                        logo_url=party.get('logo_url'),
                        votes_2024=cand.get('votes_2024', 0)
                    )
                    db.add(candidate)
            else:
                # Use AI to generate realistic candidates if API key is present
                # Fallback to alliance logic if AI fails or key is missing
                from utils.ai import gemini_client
                
                # Check for alliance logic: TDP, JSP, BJP vs YSRCP
                # In 2024, TDP+JSP+BJP alliance meant usually only one of them contested
                
                alliance_parties = ['TDP', 'JSP', 'BJP']
                alliance_choice = secrets.choice(alliance_parties)
                candidates_to_add = [alliance_choice, 'YSRCP', 'INC']
                
                ai_candidates = []
                if gemini_client.api_key:
                    try:
                        # Fetch realistic names from Gemini for this constituency
                        ai_names = await gemini_client.generate_candidate_names(const['name'], candidates_to_add)
                        if ai_names:
                            ai_candidates = ai_names
                    except Exception as e:
                        print(f"AI generation failed for {const['name']}: {e}")

                for i, party_short in enumerate(candidates_to_add):
                    if party_short not in parties:
                        continue
                    party = parties[party_short]
                    
                    # Use AI name if available, else static random
                    if i < len(ai_candidates):
                        cand_name = ai_candidates[i]
                    else:
                        names_prefix = ["Venkata", "Krishna", "Ram", "Siva", "Narayana", "Lakshmi", "Srinivas", "Rao", "Reddy", "Naidu"]
                        name_suffix = ["Rao", "Reddy", "Naidu", "Chowdary", "Goud", "Setty", "Varma"]
                        cand_name = f"{secrets.choice(names_prefix)} {secrets.choice(name_suffix)}"
                    
                    candidate = Candidate(
                        constituency_id=constituency.id,
                        name=cand_name,
                        party=party['name'],
                        party_short=party_short,
                        symbol=party['symbol'],
                        party_color=party.get('color', '#9E9E9E'),
                        logo_url=party.get('logo_url')
                    )
                    db.add(candidate)
        
        # Seed MP constituencies (offset IDs by 200)
        for const in constituency_data['mp_constituencies']:
            constituency = Constituency(
                id=200 + const['id'],
                name=const['name'],
                election_type='MP',
                district=const['district']
            )
            db.add(constituency)
            db.flush()
            
            # Check if we have real candidate data
            if const['name'] in real_mp_candidates:
                for cand in real_mp_candidates[const['name']]:
                    party = parties.get(cand['party'], parties['IND'])
                    candidate = Candidate(
                        constituency_id=constituency.id,
                        name=cand['name'],
                        party=party['name'],
                        party_short=cand['party'],
                        symbol=party['symbol'],
                        party_color=party.get('color', '#9E9E9E'),
                        logo_url=party.get('logo_url'),
                        votes_2024=cand.get('votes_2024', 0)
                    )
                    db.add(candidate)
            else:
                # Alliance Logic for MPs
                alliance_parties = ['TDP', 'JSP', 'BJP']
                alliance_choice = secrets.choice(alliance_parties)
                candidates_to_add = [alliance_choice, 'YSRCP', 'INC']

                for party_short in candidates_to_add:
                    if party_short not in parties:
                        continue
                    party = parties[party_short]
                    
                    # Realistic Names
                    names_prefix = ["Venkata", "Krishna", "Ram", "Siva", "Narayana", "Lakshmi", "Srinivas", "Subba"]
                    name_suffix = ["Raju", "Reddy", "Naidu", "Chowdary", "Goud", "Setty", "Varma"]
                    cand_name = f"{secrets.choice(names_prefix)} {secrets.choice(name_suffix)}"

                    candidate = Candidate(
                        constituency_id=constituency.id,
                        name=cand_name,
                        party=party['name'],
                        party_short=party_short,
                        symbol=party['symbol'],
                        party_color=party.get('color', '#9E9E9E'),
                        logo_url=party.get('logo_url')
                    )
                    db.add(candidate)
        
        db.commit()
        print(f"Seeded {db.query(Constituency).count()} constituencies, "
              f"{db.query(Candidate).count()} candidates, "
              f"{db.query(District).count()} districts")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


def get_constituencies_by_type(election_type: str) -> List[dict]:
    """Get all constituencies by election type (MLA/MP)"""
    db = SessionLocal()
    try:
        constituencies = db.query(Constituency).filter(
            Constituency.election_type == election_type
        ).all()
        return [
            {
                "id": c.id,
                "name": c.name,
                "district": c.district,
                "election_type": c.election_type
            }
            for c in constituencies
        ]
    finally:
        db.close()


def get_candidates_by_constituency(constituency_id: int) -> List[dict]:
    """Get all candidates for a constituency"""
    db = SessionLocal()
    try:
        candidates = db.query(Candidate).filter(
            Candidate.constituency_id == constituency_id
        ).all()
        return [
            {
                "id": c.id,
                "name": c.name,
                "party": c.party,
                "party_short": c.party_short,
                "symbol": c.symbol,
                "party_color": c.party_color,
                "logo_url": c.logo_url,
                "votes_2024": c.votes_2024
            }
            for c in candidates
        ]
    finally:
        db.close()


def get_vote_counts_by_constituency(constituency_id: int) -> list:
    """Get vote counts for all candidates in a constituency"""
    db = SessionLocal()
    try:
        from sqlalchemy import func
        
        results = db.query(
            Candidate.id,
            Candidate.name,
            Candidate.party_short,
            Candidate.party_color,
            func.count(Vote.id).label('vote_count')
        ).outerjoin(Vote).filter(
            Candidate.constituency_id == constituency_id
        ).group_by(Candidate.id).all()
        
        return [
            {
                "candidate_id": r[0],
                "candidate_name": r[1],
                "party": r[2],
                "party_color": r[3],
                "votes": r[4]
            }
            for r in results
        ]
    finally:
        db.close()


def get_total_votes_by_type(election_type: str) -> int:
    """Get total votes cast for an election type"""
    db = SessionLocal()
    try:
        return db.query(Vote).join(Constituency).filter(
            Constituency.election_type == election_type
        ).count()
    finally:
        db.close()


def get_party_wise_results(election_type: str) -> List[dict]:
    """Get party-wise vote totals for an election type"""
    db = SessionLocal()
    try:
        from sqlalchemy import func
        
        results = db.query(
            Candidate.party_short,
            Candidate.party_color,
            func.count(Vote.id).label('total_votes')
        ).join(Vote).join(Constituency).filter(
            Constituency.election_type == election_type
        ).group_by(Candidate.party_short, Candidate.party_color).order_by(
            func.count(Vote.id).desc()
        ).all()
        
        return [
            {"party": r[0], "color": r[1], "votes": r[2]}
            for r in results
        ]
    finally:
        db.close()


def get_district_vote_summary() -> List[dict]:
    """Get vote summary by district for map visualization"""
    db = SessionLocal()
    try:
        from sqlalchemy import func
        
        # Get votes per district
        results = db.query(
            Constituency.district,
            Candidate.party_short,
            Candidate.party_color,
            func.count(Vote.id).label('votes')
        ).join(Candidate, Vote.candidate_id == Candidate.id).join(
            Constituency, Vote.constituency_id == Constituency.id
        ).group_by(
            Constituency.district, Candidate.party_short, Candidate.party_color
        ).all()
        
        # Process to find leading party per district
        district_data = {}
        for r in results:
            district = r[0]
            if district not in district_data:
                district_data[district] = {"total": 0, "parties": {}}
            district_data[district]["total"] += r[3]
            if r[1] not in district_data[district]["parties"]:
                district_data[district]["parties"][r[1]] = {"votes": 0, "color": r[2]}
            district_data[district]["parties"][r[1]]["votes"] += r[3]
        
        # Find leading party
        result_list = []
        for district, data in district_data.items():
            leading = max(data["parties"].items(), key=lambda x: x[1]["votes"]) if data["parties"] else None
            result_list.append({
                "district": district,
                "total_votes": data["total"],
                "leading_party": leading[0] if leading else None,
                "leading_color": leading[1]["color"] if leading else "#9E9E9E",
                "party_breakdown": data["parties"]
            })
        
        return result_list
    finally:
        db.close()

def get_district_constituencies_results(district_name: str, election_type: str = 'MLA') -> List[dict]:
    """Get constituency-level results for a specific district"""
    db = SessionLocal()
    try:
        constituencies = db.query(Constituency).filter(
            Constituency.district == district_name,
            Constituency.election_type == election_type
        ).all()
        
        results = []
        for const in constituencies:
            const_results = get_vote_counts_by_constituency(const.id)
            total_votes = sum(r['votes'] for r in const_results)
            
            # Find winner
            winner = None
            if const_results:
                const_results.sort(key=lambda x: x['votes'], reverse=True)
                if const_results[0]['votes'] > 0:
                    winner = const_results[0]
            
            results.append({
                "id": const.id,
                "name": const.name,
                "total_votes": total_votes,
                "winner": winner,
                "all_candidates": const_results
            })
            
        return results
    finally:
        db.close()
