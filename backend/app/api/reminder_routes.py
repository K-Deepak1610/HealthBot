from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.reminder_system.scheduler_service import reminder_scheduler
from app.auth.deps import get_optional_user
from app.models import models
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ReminderCreate(BaseModel):
    title: str
    category: str
    reminder_time: str
    description: Optional[str] = ""

@router.post("/reminders")
def create_reminder(
    data: ReminderCreate, 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    return reminder_scheduler.schedule_reminder(
        db, user_id=user_id, title=data.title, time=data.reminder_time, 
        category=data.category, description=data.description
    )

@router.get("/reminders")
def get_reminders(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    return reminder_scheduler.get_upcoming_reminders(db, user_id=user_id)

@router.delete("/reminders/{id}")
def delete_reminder(
    id: int, 
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_user)
):
    user_id = current_user.id if current_user else 1
    rem = db.query(models.Reminder).filter(
        models.Reminder.id == id,
        models.Reminder.user_id == user_id
    ).first()
    
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found or access denied")
        
    db.delete(rem)
    db.commit()
    return {"status": "success"}
