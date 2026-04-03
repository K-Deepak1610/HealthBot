from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "HealthBot AI"
    DATABASE_URL: str = "sqlite:///./healthbot.db"
    
    # JWT Secret Key
    SECRET_KEY: str = "healthbot-super-secret-key-2026-change-in-production"
    
    # NVIDIA API (used as OpenAI-compatible endpoint)
    NVIDIA_API_KEY: str = "nvapi-placeholder"
    NVIDIA_BASE_URL: str = "https://integrate.api.nvidia.com/v1"
    
    # Alias: ai_service.py reads OPENAI_API_KEY — point it to NVIDIA key
    @property
    def OPENAI_API_KEY(self) -> str:
        return self.NVIDIA_API_KEY

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
