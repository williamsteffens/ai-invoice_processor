from fastapi.testclient import TestClient
from datetime import date

from app.ai.schemas import Invoice, Supplier
from app.main import app
from app.services import invoice_processing
from app.services.status import InvoiceStatus

client = TestClient(app)


def test_rejects_non_pdf():
    response = client.post(
        "/api/invoices",
        files={
            "file": (
                "test.txt",
                b"hello",
                "text/plain",
            )
        },
    )

    assert response.status_code == 400


def test_process_invoice(monkeypatch, tmp_path):
    pdf_path = tmp_path / "invoice.pdf"
    pdf_path.write_bytes(b"fake pdf")

    expected = Invoice(
        invoice_number="INV-001",
        supplier=Supplier(
            name="Acme A/S",
            vat_number="DK12345678",
        ),
        invoice_date=date(2026, 9, 1),
        due_date=date(2026, 9, 30),
        currency="DKK",
        subtotal=8000,
        vat=2000,
        total=10000,
        line_items=[],
    )

    monkeypatch.setattr(
        invoice_processing,
        "extract_text_from_pdf",
        lambda _: "Invoice INV-001 from Acme A/S",
    )

    monkeypatch.setattr(
        invoice_processing,
        "extract_invoice",
        lambda _: expected,
    )

    result = invoice_processing.process_invoice(pdf_path)

    assert result.invoice.invoice_number == "INV-001"
    assert result.invoice.total == 10000
    assert result.status == InvoiceStatus.APPROVED
    assert result.validation_errors == []