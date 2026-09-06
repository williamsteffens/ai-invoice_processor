from fastapi import APIRouter

from app.api.routes import health, invoices

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(invoices.router)