from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.exceptions import APIException
import structlog

logger = structlog.get_logger()

async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for all unhandled exceptions"""
    logger.error("unhandled_exception", error=str(exc), path=str(request.url), method=request.method)
    
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
            "details": {
                "path": str(request.url),
                "method": request.method,
            }
        }
    )

async def api_exception_handler(request: Request, exc: APIException):
    """Handler for custom APIExceptions"""
    logger.warning("api_exception", error_code=exc.error_code, message=exc.message, path=str(request.url))
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.error_code,
            "message": exc.message,
            "details": exc.details
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors"""
    logger.warning("validation_error", errors=exc.errors(), path=str(request.url))
    return JSONResponse(
        status_code=422,
        content={
            "status": "error",
            "code": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "details": exc.errors()
        }
    )

def setup_exception_handlers(app: FastAPI):
    """Register all exception handlers"""
    app.add_exception_handler(Exception, global_exception_handler)
    app.add_exception_handler(APIException, api_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
