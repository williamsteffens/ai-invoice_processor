from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@db:5432/invoices"

    class Config:
        env_file = ".env"

settings = Settings()