import uvicorn
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import app

if __name__ == "__main__":
    try:
        print("Starting backend on port 8080...")
        uvicorn.run(app, host="0.0.0.0", port=8080)
    except Exception as e: # This might not catch binding errors from uvicorn directly if it handles them internally
        print(f"Failed on 8080: {e}")
        try:
            print("Trying port 8081...")
            uvicorn.run(app, host="0.0.0.0", port=8081)
        except Exception as e2:
            print(f"Failed on 8081: {e2}")
