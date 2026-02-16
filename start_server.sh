#!/bin/bash

# Kill existing processes
echo "Killing existing processes..."
pkill -f "uvicorn"
pkill -f "vite"
fuser -k 8080/tcp
fuser -k 8081/tcp
fuser -k 5173/tcp

# Wait a moment
sleep 2

# Start Backend
echo "Starting Backend on 8081..."
cd backend
nohup python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8081 > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Start Frontend
echo "Starting Frontend..."
cd ../frontend-react
nohup npm run dev -- --port 5173 > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "Servers started."
