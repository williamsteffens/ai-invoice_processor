from datetime import date

from app.ai.schemas import Invoice, InvoiceLineItem, Supplier


def test_invoice_schema():
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
        line_items=[
            InvoiceLineItem(
                description="Consulting",
                quantity=10,
                unit_price=800,
                total=8000,
            )
        ],
    )

    assert invoice.invoice_number == "INV-001"
    assert invoice.total == 10000
    assert len(invoice.line_items) == 1
    # assert invoice.line_items[0].description == "Consulting"