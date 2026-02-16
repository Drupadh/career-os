import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8080/api/v1"

def seed_data():
    print("Seeding data...")
    
    # Demo Jobs
    jobs = [
        {"company": "TechCorp", "position": "Senior Frontend Engineer", "status": "Interviewing", "location": "San Francisco, CA", "date_applied": datetime.now().isoformat()},
        {"company": "StartupInc", "position": "Full Stack Developer", "status": "Applied", "location": "Remote", "date_applied": datetime.now().isoformat()},
        {"company": "BigData Co", "position": "Data Engineer", "status": "Offer", "location": "New York, NY", "date_applied": datetime.now().isoformat()}
    ]

    # Demo Contacts
    contacts = [
        {"name": "Sarah Miller", "role": "Engineering Manager", "company": "TechCorp", "email": "sarah@techcorp.com", "referral_status": "Connected", "last_contact": datetime.now().isoformat()},
        {"name": "David Chen", "role": "Recruiter", "company": "StartupInc", "email": "david@startup.io", "referral_status": "Requesting", "last_contact": datetime.now().isoformat()}
    ]

    for job in jobs:
        try:
            requests.post(f"{BASE_URL}/jobs/", json=job)
            print(f"Added job: {job['company']}")
        except Exception as e:
            print(f"Error adding job: {e}")

    for contact in contacts:
        try:
            requests.post(f"{BASE_URL}/contacts/", json=contact)
            print(f"Added contact: {contact['name']}")
        except Exception as e:
            print(f"Error adding contact: {e}")

    print("Data seeding complete.")

if __name__ == "__main__":
    seed_data()
