from fastapi import APIRouter

from app.api.routes import health_controller
from app.api.routes import invoices_controller

api_router = APIRouter()

api_router.include_router(health_controller.router)
api_router.include_router(invoices_controller.router)