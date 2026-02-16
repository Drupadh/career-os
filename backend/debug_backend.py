import sys
import os
import traceback

# Force unbuffered stdout
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

print("STEP 1: Starting debug script...")
try:
    print("STEP 2: Importing app.main...")
    from app.main import app
    print("STEP 3: app.main imported successfully.")
    
    import uvicorn
    print("STEP 4: Importing uvicorn successfully.")
    
    print("STEP 5: Attempting to run uvicorn on port 8081...")
    uvicorn.run(app, host="0.0.0.0", port=8081)
    print("STEP 6: Uvicorn run returned.")
    
except Exception:
    print("FAILURE: Exception caught!")
    traceback.print_exc()
except SystemExit as e:
    print(f"FAILURE: SystemExit caught: {e}")

