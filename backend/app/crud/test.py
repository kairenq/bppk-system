from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.test import Test, Question, Answer
from app.schemas.test import TestCreate, TestUpdate, QuestionCreate
from datetime import datetime


def get_test(db: Session, test_id: int) -> Optional[Test]:
    return db.query(Test).filter(Test.id == test_id).first()


def get_tests(db: Session, skip: int = 0, limit: int = 100, teacher_id: Optional[int] = None) -> List[Test]:
    query = db.query(Test)
    if teacher_id:
        query = query.filter(Test.teacher_id == teacher_id)
    return query.offset(skip).limit(limit).all()


def get_active_tests(db: Session, skip: int = 0, limit: int = 100) -> List[Test]:
    return db.query(Test).filter(Test.is_active == True).offset(skip).limit(limit).all()


def create_test(db: Session, test: TestCreate, teacher_id: int) -> Test:
    db_test = Test(
        title=test.title,
        description=test.description,
        course_id=test.course_id,
        teacher_id=teacher_id,
        time_limit=test.time_limit,
        passing_score=test.passing_score,
        is_active=test.is_active,
    )
    db.add(db_test)
    db.flush()

    # Добавляем вопросы и ответы
    for question_data in test.questions:
        db_question = Question(
            test_id=db_test.id,
            question_text=question_data.question_text,
            question_type=question_data.question_type,
            points=question_data.points,
            order=question_data.order,
        )
        db.add(db_question)
        db.flush()

        for answer_data in question_data.answers:
            db_answer = Answer(
                question_id=db_question.id,
                answer_text=answer_data.answer_text,
                is_correct=answer_data.is_correct,
                order=answer_data.order,
            )
            db.add(db_answer)

    db.commit()
    db.refresh(db_test)
    return db_test


def update_test(db: Session, test_id: int, test: TestUpdate) -> Optional[Test]:
    db_test = get_test(db, test_id)
    if not db_test:
        return None

    update_data = test.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_test, field, value)

    db_test.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_test)
    return db_test


def delete_test(db: Session, test_id: int) -> bool:
    db_test = get_test(db, test_id)
    if not db_test:
        return False

    db.delete(db_test)
    db.commit()
    return True


def add_question_to_test(db: Session, test_id: int, question: QuestionCreate) -> Optional[Question]:
    db_test = get_test(db, test_id)
    if not db_test:
        return None

    db_question = Question(
        test_id=test_id,
        question_text=question.question_text,
        question_type=question.question_type,
        points=question.points,
        order=question.order,
    )
    db.add(db_question)
    db.flush()

    for answer_data in question.answers:
        db_answer = Answer(
            question_id=db_question.id,
            answer_text=answer_data.answer_text,
            is_correct=answer_data.is_correct,
            order=answer_data.order,
        )
        db.add(db_answer)

    db.commit()
    db.refresh(db_question)
    return db_question
