from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.ai.schemas import Invoice
from app.services.invoice_processing import process_invoice

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.post("", response_model=Invoice)
async def create_invoice(
    file: UploadFile = File(...),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    suffix = Path(file.filename or "invoice.pdf").suffix

    with NamedTemporaryFile(
        suffix=suffix,
        delete=False,
    ) as temp_file:
        temp_file.write(await file.read())
        temp_path = Path(temp_file.name)

    try:
        return process_invoice(temp_path)

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )

    finally:
        temp_path.unlink(missing_ok=True)