from pydantic import BaseModel
from typing import List, Optional, Dict

class EducationItem(BaseModel):
    school: str
    location: str
    degree: str
    date: str

class CertificationItem(BaseModel):
    name: str
    provider: str
    url: str

class ExperienceItem(BaseModel):
    title: str
    company: str
    location: str
    date: str
    bullets: List[str]

class ProjectItem(BaseModel):
    name: str
    stack: str
    date: str
    bullets: List[str]

class ResumeData(BaseModel):
    name: str
    phone: str
    email: str
    linkedin: str
    summary: Optional[str] = None
    education: List[EducationItem] = []
    certifications: List[CertificationItem] = []
    experience: List[ExperienceItem] = []
    projects: List[ProjectItem] = []
    skills: Dict[str, str] = {} # Category -> String of skills
