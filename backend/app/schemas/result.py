from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime


class TestResultBase(BaseModel):
    test_id: int


class TestResultCreate(TestResultBase):
    answers: Dict[str, Any]  # {"question_id": [answer_ids] или answer_text}
    started_at: datetime


class TestResult(TestResultBase):
    id: int
    student_id: int
    score: float
    max_score: int
    earned_score: int
    passed: bool
    started_at: datetime
    completed_at: datetime
    answers: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class TestResultWithDetails(TestResult):
    student_name: str
    test_title: str

    class Config:
        from_attributes = True
