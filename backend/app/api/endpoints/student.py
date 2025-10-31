from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.test import Test as TestSchema
from app.schemas.result import TestResult as TestResultSchema, TestResultCreate
from app.crud import test as crud_test
from app.crud import result as crud_result

router = APIRouter()


@router.get("/tests", response_model=List[TestSchema])
def get_available_tests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Получить список доступных активных тестов
    """
    tests = crud_test.get_active_tests(db, skip=skip, limit=limit)
    return tests


@router.get("/tests/{test_id}", response_model=TestSchema)
def get_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Получить тест по ID для прохождения
    """
    test = crud_test.get_test(db, test_id=test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not test.is_active:
        raise HTTPException(status_code=403, detail="Test is not active")

    return test


@router.post("/tests/{test_id}/submit", response_model=TestResultSchema)
def submit_test(
    test_id: int,
    result_in: TestResultCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Отправить результаты прохождения теста
    """
    test = crud_test.get_test(db, test_id=test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    if not test.is_active:
        raise HTTPException(status_code=403, detail="Test is not active")

    # Создаем результат
    try:
        result = crud_result.create_test_result(db=db, result=result_in, student_id=current_user.id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/my-results", response_model=List[TestResultSchema])
def get_my_results(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Получить результаты тестов текущего пользователя
    """
    results = crud_result.get_test_results_by_student(db, student_id=current_user.id, skip=skip, limit=limit)
    return results


@router.get("/my-statistics")
def get_my_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Получить статистику текущего пользователя
    """
    return crud_result.get_student_statistics(db, student_id=current_user.id)


@router.get("/test/{test_id}/my-attempts", response_model=List[TestResultSchema])
def get_my_test_attempts(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Получить все попытки прохождения конкретного теста
    """
    test = crud_test.get_test(db, test_id=test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    results = (
        db.query(crud_result.TestResult)
        .filter(
            crud_result.TestResult.test_id == test_id,
            crud_result.TestResult.student_id == current_user.id
        )
        .all()
    )

    return results
