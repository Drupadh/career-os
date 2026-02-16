from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, JSON
from sqlalchemy.orm import relationship as sa_relationship
from app.core.database import Base
from datetime import date

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    position = Column(String, index=True)
    status = Column(String, default="Applied") # Applied, Interviewing, Offer, Rejected
    date_applied = Column(Date, default=date.today)
    location = Column(String, nullable=True)
    url = Column(String, nullable=True)
    
    # Relationships
    contact_id = Column(Integer, ForeignKey("contacts.id"), nullable=True)
    contact = sa_relationship("Contact", back_populates="referrals")

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    company = Column(String, index=True)
    role = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    relationship = Column(String, nullable=True) # Mentor, Peer, Recruiter
    referral_status = Column(String, default="Unknown") # Unknown, Requested, Promised, Referred
    outreach_status = Column(String, default="Not Contacted") # Not Contacted, Sent, Responded
    
    # Relationships
    referrals = sa_relationship("Job", back_populates="contact")
    tasks = sa_relationship("Task", back_populates="contact", cascade="all, delete-orphan")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    completed = Column(Integer, default=0) # SQLite doesn't have Boolean, use 0/1 or Integer
    contact_id = Column(Integer, ForeignKey("contacts.id"))
    
    contact = sa_relationship("Contact", back_populates="tasks")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, default="Untitled")
    content = Column(Text, nullable=True)
    created_at = Column(Date, default=date.today)
    updated_at = Column(Date, default=date.today, onupdate=date.today)
