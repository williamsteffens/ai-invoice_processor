from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.database import Base, engine

from app.models.invoice import InvoiceModel

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Invoice Processor",
    description="AI-powered invoice processing API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")