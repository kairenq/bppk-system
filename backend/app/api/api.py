from fastapi import APIRouter
from app.api.endpoints import auth, admin, teacher, student, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(teacher.router, prefix="/teacher", tags=["teacher"])
api_router.include_router(student.router, prefix="/student", tags=["student"])
