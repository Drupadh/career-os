@echo off
echo Starting CareerOS Frontend...

cd frontend-react

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install
)

REM Start the development server
echo Starting Vite dev server on http://localhost:5173
npm run dev
