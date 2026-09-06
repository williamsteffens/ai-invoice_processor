from decimal import Decimal
from typing import List

from app.ai.schemas import Invoice


def validate_invoice(invoice: Invoice) -> List[str]:
    errors: List[str] = []

    # Check invoice total
    expected_total = (
        Decimal(str(invoice.subtotal))
        + Decimal(str(invoice.vat))
    )

    actual_total = Decimal(str(invoice.total))

    if abs(expected_total - actual_total) > Decimal("0.01"):
        errors.append(
            "Invoice total does not match subtotal + VAT."
        )

    # Check line items
    for item in invoice.line_items:
        expected_line_total = (
            Decimal(str(item.quantity))
            * Decimal(str(item.unit_price))
        )

        actual_line_total = Decimal(str(item.total))

        if abs(expected_line_total - actual_line_total) > Decimal("0.01"):
            errors.append(
                f"Line item total mismatch: {item.description}"
            )

    return errors