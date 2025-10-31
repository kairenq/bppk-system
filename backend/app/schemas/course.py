from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class Course(CourseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
