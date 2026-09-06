from datetime import date

from pydantic import BaseModel, Field


class InvoiceLineItem(BaseModel):
    description: str
    quantity: float
    unit_price: float
    total: float


class Supplier(BaseModel):
    name: str
    vat_number: str | None = None


class Invoice(BaseModel):
    invoice_number: str
    supplier: Supplier

    invoice_date: date
    due_date: date | None = None

    currency: str = Field(min_length=3, max_length=3)

    subtotal: float
    vat: float
    total: float

    line_items: list[InvoiceLineItem]