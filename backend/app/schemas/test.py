from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AnswerBase(BaseModel):
    answer_text: str
    is_correct: bool
    order: int = 0


class AnswerCreate(AnswerBase):
    pass


class Answer(AnswerBase):
    id: int
    question_id: int

    class Config:
        from_attributes = True


class QuestionBase(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"
    points: int = 1
    order: int = 0


class QuestionCreate(QuestionBase):
    answers: List[AnswerCreate]


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    question_type: Optional[str] = None
    points: Optional[int] = None
    order: Optional[int] = None


class Question(QuestionBase):
    id: int
    test_id: int
    answers: List[Answer] = []

    class Config:
        from_attributes = True


class TestBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    time_limit: Optional[int] = None
    passing_score: int = 60
    is_active: bool = True


class TestCreate(TestBase):
    questions: List[QuestionCreate] = []


class TestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    course_id: Optional[int] = None
    time_limit: Optional[int] = None
    passing_score: Optional[int] = None
    is_active: Optional[bool] = None


class Test(TestBase):
    id: int
    teacher_id: int
    created_at: datetime
    updated_at: datetime
    questions: List[Question] = []

    class Config:
        from_attributes = True


class TestListItem(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    course_id: Optional[int] = None
    time_limit: Optional[int] = None
    passing_score: int
    is_active: bool
    created_at: datetime
    questions_count: int = 0

    class Config:
        from_attributes = True
