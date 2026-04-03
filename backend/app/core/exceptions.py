from fastapi import HTTPException
from typing import Any, Dict, Optional

class APIException(HTTPException):
    """Base API Exception for HealthBot"""
    def __init__(
        self,
        status_code: int,
        error_code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=message)
        self.error_code = error_code
        self.message = message
        self.details = details or {}

class RateLimitExceeded(APIException):
    def __init__(self, message="Too many requests", details=None):
        super().__init__(
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
            message=message,
            details=details
        )

class ResourceNotFound(APIException):
    def __init__(self, message="Resource not found", details=None):
        super().__init__(
            status_code=404,
            error_code="RESOURCE_NOT_FOUND",
            message=message,
            details=details
        )

class InvalidInputException(APIException):
    def __init__(self, message="Invalid input provided", details=None):
        super().__init__(
            status_code=400,
            error_code="INVALID_INPUT",
            message=message,
            details=details
        )
