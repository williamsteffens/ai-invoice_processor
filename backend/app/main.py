from fastapi import FastAPI

from app.api.router import api_router
from app.core.database import Base, engine

from app.models.invoice import InvoiceModel

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Invoice Processor",
    description="AI-powered invoice processing API",
    version="0.1.0",
)

app.include_router(api_router, prefix="/api")