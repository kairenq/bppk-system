@echo off
echo ================================================
echo   BPPK Exam System - Backend Server
echo ================================================
echo.

cd /d "%~dp0"

echo Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn sqlalchemy alembic pydantic pydantic-settings python-jose passlib python-multipart email-validator bcrypt cryptography

echo.
echo Initializing database...
python init_db.py

echo.
echo Starting Backend server...
echo Backend will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
