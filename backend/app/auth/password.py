import re
from passlib.context import CryptContext
from app.core.exceptions import InvalidInputException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def validate_password_strength(password: str):
    """
    Ensures password is of a certain strength:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 8:
        raise InvalidInputException("Password must be at least 8 characters long")
    
    if not re.search(r"[a-z]", password):
        raise InvalidInputException("Password must contain at least one lowercase letter")
    
    if not re.search(r"[A-Z]", password):
        raise InvalidInputException("Password must contain at least one uppercase letter")
    
    if not re.search(r"\d", password):
        raise InvalidInputException("Password must contain at least one digit")
        
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise InvalidInputException("Password must contain at least one special character")
    
    return True
