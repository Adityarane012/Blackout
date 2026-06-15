@echo off
echo ===========================================
echo Starting BLACKOUT Python Backend
echo ===========================================

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH! Please install Python.
    pause
    exit /b
)

:: Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)

:: Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate.bat

:: Install dependencies
echo Installing requirements...
pip install fastapi uvicorn pydantic neo4j >nul 2>&1

:: Start the server
echo.
echo Starting Uvicorn server on port 8000...
echo Keep this window open while using the simulator!
echo.
uvicorn backend.main:app --reload --port 8000
