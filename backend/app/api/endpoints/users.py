from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.user import User as UserSchema

router = APIRouter()


@router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Получить информацию о текущем пользователе
    """
    return current_user
