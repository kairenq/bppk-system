@echo off
echo ================================================
echo   BPPK Exam System - Frontend Application
echo ================================================
echo.

cd /d "%~dp0"

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies (this may take a few minutes)...
call npm install

echo.
echo Starting Frontend application...
echo Application will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

call npm run dev

pause
