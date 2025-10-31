from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.core.security import get_password_hash


def init_db(db: Session) -> None:
    """
    Инициализация базы данных начальными данными
    """
    # Проверяем, есть ли администратор
    admin = db.query(User).filter(User.role == UserRole.ADMIN).first()

    if not admin:
        # Создаем администратора по умолчанию
        admin = User(
            email="admin@bppk.ru",
            hashed_password=get_password_hash("admin123"),
            last_name="Администратор",
            first_name="Системный",
            middle_name=None,
            role=UserRole.ADMIN,
            is_active=1,
        )
        db.add(admin)
        db.commit()
        print("Default admin created: admin@bppk.ru / admin123")

        # Создаем тестового преподавателя
        teacher = User(
            email="teacher@bppk.ru",
            hashed_password=get_password_hash("teacher123"),
            last_name="Иванов",
            first_name="Иван",
            middle_name="Иванович",
            role=UserRole.TEACHER,
            is_active=1,
        )
        db.add(teacher)

        # Создаем тестового студента
        student = User(
            email="student@bppk.ru",
            hashed_password=get_password_hash("student123"),
            last_name="Петров",
            first_name="Петр",
            middle_name="Петрович",
            role=UserRole.STUDENT,
            is_active=1,
        )
        db.add(student)

        db.commit()
        print("Test users created:")
        print("Teacher: teacher@bppk.ru / teacher123")
        print("Student: student@bppk.ru / student123")
