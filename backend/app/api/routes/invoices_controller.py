from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from sqlalchemy.orm import Session

from app.api.dto.invoice_dto import (
    InvoiceProcessingResponse,
    InvoiceListItem,
    InvoiceDetailResponse,
    ReviewRequest,
    to_invoice_list_item,
    to_invoice_detail_response,
)
from app.core.database import get_db
from app.services.invoice_processing import process_invoice
from app.services.invoice_repository import (
    get_invoice,
    get_invoices,
    save_invoice,
    review_invoice,
    delete_invoice,
)

router = APIRouter(
    prefix="/invoices",
    tags=["invoices"],
)


@router.get(
    "/{invoice_id}",
    response_model=InvoiceDetailResponse,
)
def get_invoice_by_id(
    invoice_id: int,
    db: Session = Depends(get_db),
):
    invoice = get_invoice(db, invoice_id)

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found.",
        )

    return to_invoice_detail_response(invoice)

@router.get(
    "",
    response_model=list[InvoiceListItem],
)
def list_invoices(
    db: Session = Depends(get_db),
):
    invoices = get_invoices(db)

    return [
        to_invoice_list_item(invoice)
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
            validation_errors = result.validation_errors,
        )

        return InvoiceProcessingResponse(
            status=result.status.value,
            validation_errors = result.validation_errors,
            invoice=result.invoice,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    finally:
        temp_path.unlink(missing_ok=True)
    
@router.patch("/{invoice_id}/status")
def update_invoice_status(
    invoice_id: int,
    review: ReviewRequest,
    db: Session = Depends(get_db),
):
    invoice = review_invoice(
        db=db,
        invoice_id=invoice_id,
        status=review.status,
        review_note=review.note,
    )

    if invoice is None:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    return {
        "id": invoice.id,
        "status": invoice.status,
        "reviewed_at": invoice.reviewed_at,
        "review_note": invoice.review_note,
    }
    
@router.delete("/{invoice_id}")
def delete_invoice_endpoint(
    invoice_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_invoice(
        db=db,
        invoice_id=invoice_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found",
        )

    return {
        "message": "Invoice deleted successfully",
    }
