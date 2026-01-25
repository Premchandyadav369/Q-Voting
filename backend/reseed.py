
import asyncio
from models.database import engine, Base, seed_database

async def reseed():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Seeding database...")
    await seed_database()
    print("Reseed complete.")

if __name__ == "__main__":
    asyncio.run(reseed())
