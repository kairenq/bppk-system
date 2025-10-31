from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.base import get_db
from app.api.deps import get_current_admin
from app.models.user import User, UserRole
from app.models.test import Test
from app.models.result import TestResult
from app.schemas.user import User as UserSchema, UserCreate, UserUpdate
from app.schemas.course import Course as CourseSchema, CourseCreate, CourseUpdate
from app.crud import user as crud_user
from app.crud import course as crud_course

router = APIRouter()


@router.get("/users", response_model=List[UserSchema])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    role: UserRole = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Получить список всех пользователей (только администратор)
    """
    users = crud_user.get_users(db, skip=skip, limit=limit, role=role)
    return users


@router.post("/users", response_model=UserSchema)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Создать нового пользователя (только администратор)
    """
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud_user.create_user(db=db, user=user_in)


@router.put("/users/{user_id}", response_model=UserSchema)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Обновить пользователя (только администратор)
    """
    user = crud_user.update_user(db=db, user_id=user_id, user=user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Удалить пользователя (только администратор)
    """
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")

    success = crud_user.delete_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@router.get("/statistics")
def get_system_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Получить статистику системы (только администратор)
    """
    total_users = db.query(func.count(User.id)).scalar()
    total_students = db.query(func.count(User.id)).filter(User.role == UserRole.STUDENT).scalar()
    total_teachers = db.query(func.count(User.id)).filter(User.role == UserRole.TEACHER).scalar()
    total_admins = db.query(func.count(User.id)).filter(User.role == UserRole.ADMIN).scalar()
    total_tests = db.query(func.count(Test.id)).scalar()
    total_results = db.query(func.count(TestResult.id)).scalar()
    passed_results = db.query(func.count(TestResult.id)).filter(TestResult.passed == 1).scalar()

    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_admins": total_admins,
        "total_tests": total_tests,
        "total_test_attempts": total_results,
        "passed_attempts": passed_results,
        "pass_rate": round((passed_results / total_results * 100) if total_results > 0 else 0, 2),
    }


# Управление курсами
@router.get("/courses", response_model=List[CourseSchema])
def get_courses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Получить список курсов
    """
    return crud_course.get_courses(db, skip=skip, limit=limit)


@router.post("/courses", response_model=CourseSchema)
def create_course(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Создать новый курс
    """
    return crud_course.create_course(db=db, course=course_in)


@router.put("/courses/{course_id}", response_model=CourseSchema)
def update_course(
    course_id: int,
    course_in: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Обновить курс
    """
    course = crud_course.update_course(db=db, course_id=course_id, course=course_in)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.delete("/courses/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Удалить курс
    """
    success = crud_course.delete_course(db=db, course_id=course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}
