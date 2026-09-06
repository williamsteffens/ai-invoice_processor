from datetime import date

from app.ai.schemas import Invoice, Supplier
from app.services.invoice_repository import save_invoice
from app.services.status import InvoiceStatus


def test_save_invoice(db_session):
    invoice = Invoice(
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

    saved = save_invoice(
        db=db_session,
        invoice=invoice,
        status=InvoiceStatus.APPROVED,
    )

    assert saved.id is not None
    assert saved.invoice_number == "INV-001"
    assert saved.supplier_name == "Acme A/S"
    assert saved.total == 10000
    assert saved.status == "approved"