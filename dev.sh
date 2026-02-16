#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CareerOS Development Server ===${NC}"

# Function to kill processes on specific ports
cleanup_ports() {
    echo -e "${BLUE}Checking for existing processes...${NC}"
    
    # Backend port 8080
    if lsof -ti:8080 >/dev/null; then
        echo -e "${RED}Killing stale backend process on port 8080...${NC}"
        kill -9 $(lsof -ti:8080) 2>/dev/null
    fi

    # Frontend port 5173
    if lsof -ti:5173 >/dev/null; then
        echo -e "${RED}Killing stale frontend process on port 5173...${NC}"
        kill -9 $(lsof -ti:5173) 2>/dev/null
    fi
}

cleanup_ports

# Start Backend
echo -e "${GREEN}Starting Backend (FastAPI)...${NC}"
cd backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo $BACKEND_PID > backend.pid
echo -e "Backend running with PID: $BACKEND_PID"

# Start Frontend
echo -e "${GREEN}Starting Frontend (Vite)...${NC}"
cd frontend-react
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo $FRONTEND_PID > frontend.pid
echo -e "Frontend running with PID: $FRONTEND_PID"

echo -e "${BLUE}Servers are running! Logs are being written to backend.log and frontend.log${NC}"
echo -e "${BLUE}Press CTRL+C to stop all servers.${NC}"

# Trap SIGINT (Ctrl+C) to cleanup
trap "echo -e '${RED}Stopping servers...${NC}'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; cleanup_ports; exit" INT TERM

# Wait for processes
wait
