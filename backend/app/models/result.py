from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    score = Column(Float, nullable=False)  # Балл в процентах
    max_score = Column(Integer, nullable=False)  # Максимальный балл
    earned_score = Column(Integer, nullable=False)  # Набранный балл
    passed = Column(Integer, nullable=False)  # 1 - сдал, 0 - не сдал
    started_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, default=datetime.utcnow)
    answers = Column(JSON, nullable=True)  # JSON с ответами студента

    # Relationships
    student = relationship("User", back_populates="test_results")
    test = relationship("Test", back_populates="results")
