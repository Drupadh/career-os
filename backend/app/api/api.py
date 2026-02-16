from fastapi import APIRouter
from app.api.v1 import jobs, contacts, companies, resumes

api_router = APIRouter()

api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["resumes"])
from app.api.v1 import notes
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])

