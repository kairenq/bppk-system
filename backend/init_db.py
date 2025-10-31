#!/usr/bin/env python
"""
Скрипт для инициализации базы данных
"""
from app.db.base import SessionLocal, Base, engine
from app.db.init_db import init_db

if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

    print("\nInitializing database with default data...")
    db = SessionLocal()
    try:
        init_db(db)
        print("Database initialized successfully!")
    finally:
        db.close()
