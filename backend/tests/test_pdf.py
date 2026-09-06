from pathlib import Path

from app.services.pdf import extract_text_from_pdf


FIXTURE = Path(__file__).parent / "fixtures" / "invoice.pdf"


def test_extract_text_from_pdf():
    text = extract_text_from_pdf(FIXTURE)

    assert text
    assert len(text) > 20