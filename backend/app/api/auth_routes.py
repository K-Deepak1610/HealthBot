from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import models
from app.auth import auth_handler
from app.auth.password import get_password_hash, verify_password, validate_password_strength
from app.auth.deps import get_current_active_user
from pydantic import BaseModel, EmailStr
from datetime import datetime

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str = "patient"

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Validate Password Strength
    validate_password_strength(user.password)
    
    # 2. Check existing
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 3. Hash and Save
    hashed_pw = get_password_hash(user.password)
    new_user = models.User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_pw,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 4. Create Tokens
    access_token = auth_handler.create_access_token(data={"sub": new_user.email})
    refresh_token_str, expires_at = auth_handler.create_refresh_token(data={"sub": new_user.email})
    
    # 5. Store Refresh Token
    db_refresh = models.RefreshToken(user_id=new_user.id, token=refresh_token_str, expires_at=expires_at)
    db.add(db_refresh)
    db.commit()
    
    return {"access_token": access_token, "refresh_token": refresh_token_str, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token = auth_handler.create_access_token(data={"sub": user.email})
    refresh_token_str, expires_at = auth_handler.create_refresh_token(data={"sub": user.email})
    
    # Store Refresh Token
    db_refresh = models.RefreshToken(user_id=user.id, token=refresh_token_str, expires_at=expires_at)
    db.add(db_refresh)
    db.commit()
    
    return {"access_token": access_token, "refresh_token": refresh_token_str, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
def refresh_token(request: RefreshRequest, db: Session = Depends(get_db)):
    db_token = db.query(models.RefreshToken).filter(
        models.RefreshToken.token == request.refresh_token,
        models.RefreshToken.is_revoked == False,
        models.RefreshToken.expires_at > datetime.utcnow()
    ).first()
    
    if not db_token:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
    user = db_token.user
    access_token = auth_handler.create_access_token(data={"sub": user.email})
    # Rotate refresh token
    new_refresh_str, expires_at = auth_handler.create_refresh_token(data={"sub": user.email})
    
    db_token.is_revoked = True # Revoke old one
    new_db_refresh = models.RefreshToken(user_id=user.id, token=new_refresh_str, expires_at=expires_at)
    db.add(new_db_refresh)
    db.commit()
    
    return {"access_token": access_token, "refresh_token": new_refresh_str, "token_type": "bearer"}

@router.post("/logout")
def logout(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    # Simple logout: revoke all active refresh tokens for this user
    db.query(models.RefreshToken).filter(
        models.RefreshToken.user_id == current_user.id,
        models.RefreshToken.is_revoked == False
    ).update({"is_revoked": True})
    db.commit()
    return {"message": "Logged out successfully"}
