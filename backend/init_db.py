from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base
from crud import init_default_departments

def init_database():
    """Initialize the database with default data"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Initialize default departments
        init_default_departments(db)
        print("Database initialized successfully with default departments.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()