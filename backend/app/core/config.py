from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    app_name: str = "PromptGuard AI Backend"
    app_version: str = "0.1.0"
    app_env: str = "development"
    frontend_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:3001,http://localhost:3002"
    database_url: str = "sqlite:///./data/promptguard.db"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()
