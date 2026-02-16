import sys
import os
from fastapi import FastAPI
from fastapi.routing import APIRoute

# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

try:
    from app.main import app
except ImportError:
    print("Could not import app.main. Ensure the script is run from the correct directory or the path is correct.")
    sys.exit(1)

def check_routes():
    print("Checking routes for 'mentor' or 'job_broker'...")
    found_issues = False
    for route in app.routes:
        if isinstance(route, APIRoute):
            if "mentor" in route.path.lower() or "job_broker" in route.path.lower():
                print(f"FAILED: Found suspicious route: {route.path} ({route.name})")
                found_issues = True
            
    if not found_issues:
        print("SUCCESS: No 'mentor' or 'job_broker' routes found.")
    else:
        print("FAILED: Issues found.")
        sys.exit(1)

if __name__ == "__main__":
    check_routes()
