from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core import database
from app.models import job_tracker as models
from app.schemas import job_tracker as schemas

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.Contact])
def read_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contacts = db.query(models.Contact).offset(skip).limit(limit).all()
    return contacts

@router.post("/", response_model=schemas.Contact)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.put("/{contact_id}", response_model=schemas.Contact)
def update_contact(contact_id: int, contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    db_contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    for key, value in contact.dict().items():
        setattr(db_contact, key, value)
        
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    db_contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db.delete(db_contact)
    db.commit()
    return {"ok": True}

# Tasks
@router.post("/{contact_id}/tasks", response_model=schemas.Task)
def create_task(contact_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.dict(), contact_id=contact_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{contact_id}/tasks/{task_id}")
def delete_task(contact_id: int, task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.contact_id == contact_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"ok": True}

@router.put("/{contact_id}/tasks/{task_id}/toggle")
def toggle_task(contact_id: int, task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.contact_id == contact_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.completed = 1 if db_task.completed == 0 else 0
    db.commit()
    return {"ok": True, "completed": db_task.completed}
