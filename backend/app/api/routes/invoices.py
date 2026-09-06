from datetime import date
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.ai.schemas import Invoice
from app.core.database import get_db
from app.services.invoice_processing import process_invoice
from app.services.invoice_repository import (
    save_invoice,
    get_invoices,
)

router = APIRouter(
    prefix="/invoices",
    tags=["invoices"],
)


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

@router.get(
    "",
    response_model=list[InvoiceListItem],
)
def list_invoices(
    db: Session = Depends(get_db),
):
    invoices = get_invoices(db)

    return [
        InvoiceListItem(
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
        for invoice in invoices
    ]

@router.post(
    "",
    response_model=InvoiceProcessingResponse,
)
async def create_invoice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    suffix = Path(
        file.filename or "invoice.pdf"
    ).suffix

    with NamedTemporaryFile(
        suffix=suffix,
        delete=False,
    ) as temp_file:
        temp_file.write(await file.read())
        temp_path = Path(temp_file.name)

    try:
        result = process_invoice(temp_path)

        save_invoice(
            db=db,
            invoice=result.invoice,
            status=result.status,
        )

        return InvoiceProcessingResponse(
            status=result.status.value,
            validation_errors=result.validation_errors,
            invoice=result.invoice,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    finally:
        temp_path.unlink(missing_ok=True)