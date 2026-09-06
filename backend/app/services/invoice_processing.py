from pathlib import Path

from app.ai.extractor import extract_invoice
from app.ai.schemas import Invoice
from app.services.pdf import extract_text_from_pdf


def process_invoice(file_path: Path) -> Invoice:
    text = extract_text_from_pdf(file_path)

    if not text.strip():
        raise ValueError("Invoice text is empty.")

    return extract_invoice(text)