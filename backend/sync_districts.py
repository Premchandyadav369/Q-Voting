
import asyncio
from sqlalchemy import text
from models.database import SessionLocal, Constituency, District, engine

async def sync_districts():
    db = SessionLocal()
    try:
        print("Syncing districts from Constituencies...")
        
        # Get all unique districts from Constituencies
        results = db.query(Constituency.district).distinct().all()
        unique_districts = [r[0] for r in results]
        
        print(f"Found {len(unique_districts)} unique districts in Constituency data.")
        
        for dist_name in unique_districts:
            existing = db.query(District).filter(District.name == dist_name).first()
            if not existing:
                print(f"Adding missing district: {dist_name}")
                new_dist = District(name=dist_name, mla_count=0, mp_count=0)
                db.add(new_dist)
        
        db.commit()
        
        # Update counts
        print("Updating counts...")
        districts = db.query(District).all()
        for dist in districts:
            mla_c = db.query(Constituency).filter(Constituency.district == dist.name, Constituency.election_type == 'MLA').count()
            mp_c = db.query(Constituency).filter(Constituency.district == dist.name, Constituency.election_type == 'MP').count()
            
            dist.mla_count = mla_c
            dist.mp_count = mp_c
            
        db.commit()
        print("District sync complete.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(sync_districts())
