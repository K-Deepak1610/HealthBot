from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.exceptions import RateLimitExceeded
import time
from collections import defaultdict

# Simple memory-based rate limiting for immediate iterations
# For production, this should be replaced with a Redis-backed token bucket
request_counts = defaultdict(list)
RATE_LIMIT_DURATION = 60
RATE_LIMIT_REQUESTS = 100

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()
        
        # Clean up old records
        request_counts[client_ip] = [req_time for req_time in request_counts[client_ip] if current_time - req_time < RATE_LIMIT_DURATION]
        
        if len(request_counts[client_ip]) >= RATE_LIMIT_REQUESTS:
            # Raise custom RateLimit exception
            # This relies on the global exception handler we created
            raise RateLimitExceeded(
                message=f"Rate limit exceeded. Try again in {RATE_LIMIT_DURATION} seconds.",
                details={"limit": RATE_LIMIT_REQUESTS, "window_s": RATE_LIMIT_DURATION}
            )
        
        request_counts[client_ip].append(current_time)
        return await call_next(request)
