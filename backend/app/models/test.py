from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base


class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    time_limit = Column(Integer, nullable=True)  # Время в минутах
    passing_score = Column(Integer, default=60)  # Проходной балл в процентах
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    teacher = relationship("User", back_populates="created_tests", foreign_keys=[teacher_id])
    course = relationship("Course", back_populates="tests")
    questions = relationship("Question", back_populates="test", cascade="all, delete-orphan")
    results = relationship("TestResult", back_populates="test")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String, default="multiple_choice")  # multiple_choice, single_choice, text
    points = Column(Integer, default=1)
    order = Column(Integer, default=0)

    # Relationships
    test = relationship("Test", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order = Column(Integer, default=0)

    # Relationships
    question = relationship("Question", back_populates="answers")
