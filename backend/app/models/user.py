from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # ФИО в трех полях
    last_name = Column(String, nullable=False)  # Фамилия
    first_name = Column(String, nullable=False)  # Имя
    middle_name = Column(String, nullable=True)  # Отчество (вариативное)

    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Integer, default=1)

    # Relationships
    created_tests = relationship("Test", back_populates="teacher", foreign_keys="Test.teacher_id")
    test_results = relationship("TestResult", back_populates="student")
