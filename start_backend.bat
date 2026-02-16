@echo off
echo Starting CareerOS Backend Server...

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Start the backend server
echo Starting Uvicorn server on http://localhost:8081
python -m uvicorn app.main:app --host 0.0.0.0 --port 8081 --reload
