@echo off
echo Starting CareerOS in Development Mode...
echo.
echo Opening two terminals:
echo 1. Backend (http://localhost:8081)
echo 2. Frontend (http://localhost:5173)
echo.

REM Start backend in new window
start "CareerOS Backend" cmd /k "start_backend.bat"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

REM Start frontend in new window
start "CareerOS Frontend" cmd /k "start_frontend.bat"

echo.
echo Both servers starting...
echo Backend: http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit (servers will keep running)...
pause > nul
