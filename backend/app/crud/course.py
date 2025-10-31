from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate


def get_course(db: Session, course_id: int) -> Optional[Course]:
    return db.query(Course).filter(Course.id == course_id).first()


def get_courses(db: Session, skip: int = 0, limit: int = 100) -> List[Course]:
    return db.query(Course).offset(skip).limit(limit).all()


def create_course(db: Session, course: CourseCreate) -> Course:
    db_course = Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course


def update_course(db: Session, course_id: int, course: CourseUpdate) -> Optional[Course]:
    db_course = get_course(db, course_id)
    if not db_course:
        return None

    update_data = course.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_course, field, value)

    db.commit()
    db.refresh(db_course)
    return db_course


def delete_course(db: Session, course_id: int) -> bool:
    db_course = get_course(db, course_id)
    if not db_course:
        return False

    db.delete(db_course)
    db.commit()
    return True
