from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
import re


class ChatMessage(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    role: str = Field(default="user")  # Accept any role value from frontend
    timestamp: Optional[str] = None   # Allow string timestamps from frontend

    @field_validator('role', mode='before')
    @classmethod
    def normalize_role(cls, v: str) -> str:
        """Normalize 'bot' → 'assistant' for OpenAI compatibility."""
        if v == 'bot':
            return 'assistant'
        if v not in ('user', 'assistant', 'system'):
            return 'user'
        return v

    @field_validator('content')
    @classmethod
    def validate_content(cls, v: str) -> str:
        # Basic XSS / prompt injection protection
        dangerous_patterns = [r'<script\b[^>]*>.*?</script>', r'javascript:', r'onerror=']
        for pattern in dangerous_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError("Script tags or execution code not permitted in chat.")
        return v.strip()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    chat_history: Optional[List[ChatMessage]] = Field(default_factory=list)

    @field_validator('message')
    @classmethod
    def validate_message(cls, v: str) -> str:
        return v.strip()
