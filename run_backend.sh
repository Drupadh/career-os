#!/bin/bash
cd backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080 > ../backend.log 2>&1 &
echo $! > ../backend.pid
