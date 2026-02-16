#!/bin/bash
echo "=== Python Location ==="
which python3
/usr/bin/python3 --version

echo "=== Python Executable and Path ==="
python3 -c "import sys; print(sys.executable); print(sys.path)"

echo "=== Uvicorn Version ==="
python3 -m uvicorn --version
uvicorn --version

echo "=== Pip List ==="
pip list | grep -E "fastapi|uvicorn"

echo "=== Attempting Backend Import ==="
cd backend
python3 -c "from app.main import app; print('Import Success')"
