from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.base import get_db
from app.api.deps import get_current_teacher
from app.models.user import User
from app.models.test import Test
from app.models.result import TestResult
from app.schemas.test import Test as TestSchema, TestCreate, TestUpdate, TestListItem
from app.schemas.result import TestResult as TestResultSchema
from app.crud import test as crud_test
from app.crud import result as crud_result

router = APIRouter()


@router.get("/tests", response_model=List[TestSchema])
def get_my_tests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Получить список тестов преподавателя
    """
    tests = crud_test.get_tests(db, skip=skip, limit=limit, teacher_id=current_user.id)
    return tests


@router.get("/tests/{test_id}", response_model=TestSchema)
def get_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Получить тест по ID
    """
    test = crud_test.get_test(db, test_id=test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Проверяем, что текущий пользователь - владелец теста
    if test.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return test


@router.post("/tests", response_model=TestSchema)
def create_test(
    test_in: TestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Создать новый тест
    """
    return crud_test.create_test(db=db, test=test_in, teacher_id=current_user.id)


@router.put("/tests/{test_id}", response_model=TestSchema)
def update_test(
    test_id: int,
    test_in: TestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Обновить тест
    """
    test = crud_test.get_test(db, test_id=test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Проверяем, что текущий пользователь - владелец теста
    if test.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    updated_test = crud_test.update_test(db=db, test_id=test_id, test=test_in)
    return updated_test


@router.delete("/tests/{test_id}")
def delete_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Удалить тест
    """
    test = crud_test.get_test(db, test_id=test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Проверяем, что текущий пользователь - владелец теста
    if test.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    crud_test.delete_test(db=db, test_id=test_id)
    return {"message": "Test deleted successfully"}


@router.get("/tests/{test_id}/results", response_model=List[TestResultSchema])
def get_test_results(
    test_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Получить результаты теста
    """
    test = crud_test.get_test(db, test_id=test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    # Проверяем, что текущий пользователь - владелец теста
    if test.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    results = crud_result.get_test_results_by_test(db, test_id=test_id, skip=skip, limit=limit)
    return results


@router.get("/statistics")
def get_teacher_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Получить статистику преподавателя
    """
    # Количество созданных тестов
    total_tests = db.query(func.count(Test.id)).filter(Test.teacher_id == current_user.id).scalar()

    # Количество попыток прохождения тестов
    total_attempts = (
        db.query(func.count(TestResult.id))
        .join(Test)
        .filter(Test.teacher_id == current_user.id)
        .scalar()
    )

    # Количество успешных попыток
    passed_attempts = (
        db.query(func.count(TestResult.id))
        .join(Test)
        .filter(Test.teacher_id == current_user.id, TestResult.passed == 1)
        .scalar()
    )

    # Средний балл
    avg_score = (
        db.query(func.avg(TestResult.score))
        .join(Test)
        .filter(Test.teacher_id == current_user.id)
        .scalar()
    )

    return {
        "total_tests": total_tests,
        "total_attempts": total_attempts,
        "passed_attempts": passed_attempts,
        "pass_rate": round((passed_attempts / total_attempts * 100) if total_attempts > 0 else 0, 2),
        "average_score": round(float(avg_score) if avg_score else 0, 2),
    }


@router.get("/students-performance")
def get_students_performance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_teacher),
):
    """
    Получить успеваемость студентов по тестам преподавателя
    """
    results = (
        db.query(TestResult, User, Test)
        .join(User, TestResult.student_id == User.id)
        .join(Test, TestResult.test_id == Test.id)
        .filter(Test.teacher_id == current_user.id)
        .order_by(TestResult.completed_at.desc())
        .limit(100)
        .all()
    )

    performance_data = []
    for result, student, test in results:
        performance_data.append({
            "student_name": f"{student.last_name} {student.first_name} {student.middle_name or ''}".strip(),
            "student_email": student.email,
            "test_title": test.title,
            "score": result.score,
            "passed": bool(result.passed),
            "completed_at": result.completed_at,
        })

    return performance_data
