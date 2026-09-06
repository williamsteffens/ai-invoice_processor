from datetime import date

from app.ai.schemas import Invoice, InvoiceLineItem, Supplier
from app.services.validation import validate_invoice


def make_invoice(
    subtotal=8000,
    vat=2000,
    total=10000,
):
    return Invoice(
        invoice_number="INV-001",
        supplier=Supplier(
            name="Acme A/S",
            vat_number="DK12345678",
        ),
        invoice_date=date(2026, 9, 1),
        due_date=date(2026, 9, 30),
        currency="DKK",
        subtotal=subtotal,
        vat=vat,
        total=total,
        line_items=[
            InvoiceLineItem(
                description="Consulting",
                quantity=10,
                unit_price=800,
                total=8000,
            )
        ],
    )


def test_valid_invoice():
    invoice = make_invoice()

    errors = validate_invoice(invoice)

    assert errors == []


def test_invalid_invoice_total():
    invoice = make_invoice(total=12000)

    errors = validate_invoice(invoice)

    assert "Invoice total does not match subtotal + VAT." in errors


def test_invalid_line_item_total():
    invoice = make_invoice()

    invoice.line_items[0].total = 9000

    errors = validate_invoice(invoice)

    assert "Line item total mismatch: Consulting" in errors