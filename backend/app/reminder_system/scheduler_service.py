from datetime import datetime
from sqlalchemy.orm import Session
from app.models import models

class ReminderScheduler:
    def __init__(self):
        pass

    def schedule_reminder(self, db: Session, user_id: int, title: str, time: str, category: str, description: str = ""):
        new_reminder = models.Reminder(
            user_id=user_id,
            title=title,
            description=description,
            reminder_time=time,
            category=category
        )
        db.add(new_reminder)
        db.commit()
        db.refresh(new_reminder)
        return new_reminder

    def get_upcoming_reminders(self, db: Session, user_id: int):
        # In a real app, this would filter by current time/date
        return db.query(models.Reminder).filter(models.Reminder.user_id == user_id).all()

reminder_scheduler = ReminderScheduler()
