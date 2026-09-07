from datetime import date, datetime

from pydantic import BaseModel

from app.ai.schemas import Invoice
from app.services.status import InvoiceStatus


class InvoiceProcessingResponse(BaseModel):
    status: str
    validation_errors: list[str]
    invoice: Invoice

class InvoiceListItem(BaseModel):
    id: int
    invoice_number: str
    supplier_name: str
    supplier_vat_number: str | None
    invoice_date: date
    due_date: date | None
    currency: str
    subtotal: float
    vat: float
    total: float
    status: str

class LineItemResponse(BaseModel):
    id: int
    description: str
    quantity: float
    unit_price: float
    total: float

class InvoiceDetailResponse(BaseModel):
    id: int
    invoice_number: str
    supplier_name: str
    supplier_vat_number: str | None
    invoice_date: date
    due_date: date | None
    currency: str
    subtotal: float
    vat: float
    total: float
    status: str
    reviewed_at: datetime | None
    review_note: str | None
    line_items: list[LineItemResponse]
    validation_errors: list[str]

class ReviewRequest(BaseModel):
    status: InvoiceStatus
    note: str | None = None


def to_invoice_list_item(invoice) -> InvoiceListItem:
    return InvoiceListItem(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        supplier_name=invoice.supplier_name,
        supplier_vat_number=invoice.supplier_vat_number,
        invoice_date=invoice.invoice_date,
        due_date=invoice.due_date,
        currency=invoice.currency,
        subtotal=invoice.subtotal,
        vat=invoice.vat,
        total=invoice.total,
        status=invoice.status,
    )

def to_invoice_detail_response(invoice) -> InvoiceDetailResponse:
    return InvoiceDetailResponse(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        supplier_name=invoice.supplier_name,
        supplier_vat_number=invoice.supplier_vat_number,
        invoice_date=invoice.invoice_date,
        due_date=invoice.due_date,
        currency=invoice.currency,
        subtotal=invoice.subtotal,
        vat=invoice.vat,
        total=invoice.total,
        status=invoice.status,
        reviewed_at=invoice.reviewed_at,
        review_note=invoice.review_note,
        line_items=[
            LineItemResponse(
                id=item.id,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total=item.total,
            )
            for item in invoice.line_items
        ],
        validation_errors=[
            error.message
            for error in invoice.validation_errors
        ],
    )