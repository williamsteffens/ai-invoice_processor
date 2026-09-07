from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai.schemas import Invoice
from app.models.invoice import (
    InvoiceLineItemModel,
    InvoiceModel,
    InvoiceValidationErrorModel,
)
from app.services.status import InvoiceStatus


def save_invoice(
    db: Session,
    invoice: Invoice,
    status: InvoiceStatus,
    validation_errors: list[str],
) -> InvoiceModel:

    db_invoice = InvoiceModel(
        invoice_number=invoice.invoice_number,
        supplier_name=invoice.supplier.name,
        supplier_vat_number=invoice.supplier.vat_number,
        invoice_date=invoice.invoice_date,
        due_date=invoice.due_date,
        currency=invoice.currency,
        subtotal=invoice.subtotal,
        vat=invoice.vat,
        total=invoice.total,
        status=status.value,
    )

    db.add(db_invoice)
    db.flush()

    for item in invoice.line_items:
        db_invoice.line_items.append(
            InvoiceLineItemModel(
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total=item.total,
            )
        )

    for error in validation_errors:
        db.add(
            InvoiceValidationErrorModel(
                invoice_id=db_invoice.id,
                message=error,
            )
        )

    db.commit()
    db.refresh(db_invoice)

    return db_invoice


def get_invoices(
    db: Session,
) -> list[InvoiceModel]:
    statement = select(InvoiceModel).order_by(
        InvoiceModel.id.desc()
    )

    return list(db.scalars(statement).all())


def get_invoice(
    db: Session,
    invoice_id: int,
) -> InvoiceModel | None:
    statement = select(InvoiceModel).where(
        InvoiceModel.id == invoice_id
    )

    return db.scalar(statement)


def review_invoice(
    db: Session,
    invoice_id: int,
    status: InvoiceStatus,
    review_note: str | None = None,
) -> InvoiceModel | None:

    invoice = get_invoice(db, invoice_id)

    if invoice is None:
        return None

    invoice.status = status.value
    invoice.reviewed_at = datetime.utcnow()
    invoice.review_note = review_note

    db.commit()
    db.refresh(invoice)

    return invoice