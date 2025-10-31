from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.result import TestResult
from app.models.test import Test, Question, Answer
from app.schemas.result import TestResultCreate
from datetime import datetime


def get_test_result(db: Session, result_id: int) -> Optional[TestResult]:
    return db.query(TestResult).filter(TestResult.id == result_id).first()


def get_test_results_by_student(db: Session, student_id: int, skip: int = 0, limit: int = 100) -> List[TestResult]:
    return db.query(TestResult).filter(TestResult.student_id == student_id).offset(skip).limit(limit).all()


def get_test_results_by_test(db: Session, test_id: int, skip: int = 0, limit: int = 100) -> List[TestResult]:
    return db.query(TestResult).filter(TestResult.test_id == test_id).offset(skip).limit(limit).all()


def create_test_result(db: Session, result: TestResultCreate, student_id: int) -> TestResult:
    # Получаем тест и его вопросы
    test = db.query(Test).filter(Test.id == result.test_id).first()
    if not test:
        raise ValueError("Test not found")

    # Подсчитываем результаты
    max_score = 0
    earned_score = 0

    for question in test.questions:
        max_score += question.points

        question_id_str = str(question.id)
        if question_id_str in result.answers:
            student_answers = result.answers[question_id_str]

            # Для вопросов с множественным выбором
            if question.question_type in ["multiple_choice", "single_choice"]:
                correct_answer_ids = {answer.id for answer in question.answers if answer.is_correct}

                # Преобразуем student_answers в set
                if isinstance(student_answers, list):
                    student_answer_ids = set(student_answers)
                else:
                    student_answer_ids = {student_answers}

                # Проверяем правильность
                if student_answer_ids == correct_answer_ids:
                    earned_score += question.points

    # Вычисляем процент
    score = (earned_score / max_score * 100) if max_score > 0 else 0
    passed = score >= test.passing_score

    db_result = TestResult(
        student_id=student_id,
        test_id=result.test_id,
        score=score,
        max_score=max_score,
        earned_score=earned_score,
        passed=1 if passed else 0,
        started_at=result.started_at,
        completed_at=datetime.utcnow(),
        answers=result.answers,
    )

    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result


def get_student_statistics(db: Session, student_id: int):
    results = db.query(TestResult).filter(TestResult.student_id == student_id).all()

    total_tests = len(results)
    passed_tests = sum(1 for r in results if r.passed)
    average_score = sum(r.score for r in results) / total_tests if total_tests > 0 else 0

    return {
        "total_tests": total_tests,
        "passed_tests": passed_tests,
        "failed_tests": total_tests - passed_tests,
        "average_score": round(average_score, 2),
    }
