from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# --- Tasks ---
class TaskBase(BaseModel):
    text: str
    completed: int = 0

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    contact_id: int
    class Config:
        from_attributes = True

# --- Contacts ---
class ContactBase(BaseModel):
    name: str
    company: Optional[str] = None
    role: Optional[str] = None
    linkedin: Optional[str] = None
    whatsapp: Optional[str] = None
    relationship: Optional[str] = None
    referral_status: str = "Unknown"
    outreach_status: str = "Not Contacted"

class ContactCreate(ContactBase):
    pass

class Contact(ContactBase):
    id: int
    tasks: List[Task] = []
    class Config:
        from_attributes = True

# --- Jobs ---
class JobBase(BaseModel):
    company: str
    position: str
    status: str = "Applied"
    date_applied: Optional[date] = None
    location: Optional[str] = None
    url: Optional[str] = None
    contact_id: Optional[int] = None

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    contact: Optional[Contact] = None
    class Config:
        from_attributes = True

# --- Companies ---
class CompanyBase(BaseModel):
    name: str
    url: Optional[str] = None
    notes: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    class Config:
        from_attributes = True

# --- Notes ---
class NoteBase(BaseModel):
    title: str = "Untitled"
    content: Optional[str] = None
    created_at: Optional[date] = None
    updated_at: Optional[date] = None

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    class Config:
        from_attributes = True
