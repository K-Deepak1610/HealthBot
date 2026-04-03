from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class IsDeletedMixin:
    is_deleted = Column(Boolean, default=False, index=True)

class User(Base, TimestampMixin, IsDeletedMixin):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="patient", index=True)
    is_active = Column(Boolean, default=True, index=True)
    
    reminders = relationship("Reminder", back_populates="user")
    symptom_checks = relationship("SymptomCheck", back_populates="user")
    prescriptions = relationship("Prescription", back_populates="user")
    chat_history = relationship("ChatHistory", back_populates="user")
    refresh_tokens = relationship("RefreshToken", back_populates="user")

class RefreshToken(Base, TimestampMixin):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    token = Column(String, unique=True, index=True)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="refresh_tokens")

class SymptomCheck(Base, TimestampMixin, IsDeletedMixin):
    __tablename__ = "symptom_checks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    query = Column(Text)
    analysis = Column(Text)
    
    user = relationship("User", back_populates="symptom_checks")

class Prescription(Base, TimestampMixin, IsDeletedMixin):
    __tablename__ = "prescriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    image_url = Column(String)
    extracted_text = Column(Text)
    identified_medicines = Column(Text) # JSON string
    
    user = relationship("User", back_populates="prescriptions")

class Reminder(Base, TimestampMixin, IsDeletedMixin):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String)
    description = Column(Text)
    reminder_time = Column(String) # Cron or ISO string
    is_active = Column(Boolean, default=True)
    category = Column(String, index=True) # medicine, water, checkup, exercise
    
    user = relationship("User", back_populates="reminders")

class ChatHistory(Base, TimestampMixin, IsDeletedMixin):
    __tablename__ = "chat_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    message = Column(Text)
    role = Column(String) # user or assistant
    
    user = relationship("User", back_populates="chat_history")

class MedicineInfo(Base, TimestampMixin, IsDeletedMixin):
    __tablename__ = "medicine_info"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, index=True)
    purpose = Column(Text)
    dosage = Column(Text)
    side_effects = Column(Text)
    precautions = Column(Text)
    warnings = Column(Text)

# Adding an explicit composite index for medicine lookup if needed
Index('ix_medicine_name_category', MedicineInfo.name, MedicineInfo.category)
