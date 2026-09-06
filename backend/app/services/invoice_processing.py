from pathlib import Path

from app.ai.extractor import extract_invoice
from app.ai.schemas import Invoice
from app.services.pdf import extract_text_from_pdf
from app.services.result import ProcessingResult
from app.services.status import InvoiceStatus
from app.services.validation import validate_invoice


def process_invoice(file_path: Path) -> ProcessingResult:
    text = extract_text_from_pdf(file_path)

    if not text.strip():
        raise ValueError("Could not extract text from PDF.")

    invoice: Invoice = extract_invoice(text)

    validation_errors = validate_invoice(invoice)

    if validation_errors:
        status = InvoiceStatus.NEEDS_REVIEW
    else:
        status = InvoiceStatus.APPROVED

    return ProcessingResult(
        invoice=invoice,
        status=status,
        validation_errors=validation_errors,
    )