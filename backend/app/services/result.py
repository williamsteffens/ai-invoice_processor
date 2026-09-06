from dataclasses import dataclass

from app.ai.schemas import Invoice
from app.services.status import InvoiceStatus


@dataclass
class ProcessingResult:
    invoice: Invoice
    status: InvoiceStatus
    validation_errors: list[str]