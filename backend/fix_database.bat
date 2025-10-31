@echo off
echo ================================================
echo   Fixing Database - Recreating with SHA256
echo ================================================
echo.

cd /d "%~dp0"

echo Step 1: Stopping any running backend...
taskkill /F /IM python.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Removing old database...
if exist bppk_exam.db (
    del bppk_exam.db
    echo Old database removed.
) else (
    echo No old database found.
)

echo.
echo Step 3: Installing/updating dependencies...
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose passlib python-multipart email-validator cryptography

echo.
echo Step 4: Creating new database with test users...
python init_db.py

echo.
echo ================================================
echo   Database fixed successfully!
echo ================================================
echo.
echo Test accounts:
echo   Admin:   admin@bppk.ru / admin123
echo   Teacher: teacher@bppk.ru / teacher123
echo   Student: student@bppk.ru / student123
echo.
echo Now run start_backend.bat to start the server.
echo.
pause
