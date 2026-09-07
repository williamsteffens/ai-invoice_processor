from fastapi import APIRouter

from backend.app.api.routes import health_controller
from backend.app.api.routes import invoices_controller

api_router = APIRouter()

api_router.include_router(health_controller.router)
api_router.include_router(invoices_controller.router)