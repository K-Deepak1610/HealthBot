from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time
import structlog
import uuid

logger = structlog.get_logger()

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start_time = time.time()
        
        # Add request_id to logger context
        log = logger.bind(request_id=request_id)
        
        log.info("request_started", method=request.method, path=str(request.url))
        
        try:
            response = await call_next(request)
            
            process_time = time.time() - start_time
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            log.info("request_finished", status_code=response.status_code, process_time_s=round(process_time, 4))
            return response
        except Exception as e:
            process_time = time.time() - start_time
            log.error("request_failed", error=str(e), process_time_s=round(process_time, 4))
            raise
