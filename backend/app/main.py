from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api import health_routes, medicine_routes, reminder_routes, auth_routes, chat_routes
from app.seed import seed_data
import structlog

# Import middlewares and exception setups
from app.middleware.error_handler import setup_exception_handlers
from app.middleware.logging import LoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

logger = structlog.get_logger()

tags_metadata = [
    {
        "name": "Authentication",
        "description": "Secure user access and session management.",
    },
    {
        "name": "Chat",
        "description": "AI-powered medical assistant conversation endpoints.",
    },
    {
        "name": "Medicine",
        "description": "Search and retrieve medicine information.",
    },
    {
        "name": "Reminders",
        "description": "Manage user dosage and pill schedules.",
    },
    {
        "name": "Health",
        "description": "Health checks, symptom analysis, and prescription upload.",
    },
]

app = FastAPI(
    title="HealthBot AI Platform",
    description="Enterprise-grade Medical AI SaaS API providing chat, symptom analysis, and medicine tracking.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=tags_metadata,
)

# Setup custom Exception Handlers
setup_exception_handlers(app)

# Add Middlewares (Order matters — innermost first)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)

# CORS Configuration — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial data
try:
    seed_data()
    logger.info("database_seeded_successfully")
except Exception as e:
    logger.error("database_seed_failed", error=str(e))

# Include Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(health_routes.router, prefix="/api", tags=["Health"])
app.include_router(medicine_routes.router, prefix="/api", tags=["Medicine"])
app.include_router(reminder_routes.router, prefix="/api", tags=["Reminders"])
app.include_router(chat_routes.router, prefix="/api", tags=["Chat"])


@app.get("/health", tags=["Health"])
def health_check():
    """Quick service liveness check."""
    return {"status": "healthy", "service": "HealthBot AI Platform", "version": "2.0.0"}


@app.get("/", tags=["Health"])
def read_root():
    return {"message": "Welcome to HealthBot AI Enterprise API v2.0", "docs": "/docs"}
