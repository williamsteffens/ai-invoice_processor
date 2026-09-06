from sqlalchemy.orm import Session

from app.ai.schemas import Invoice
from app.models.invoice import InvoiceModel
from app.services.status import InvoiceStatus


def save_invoice(
    db: Session,
    invoice: Invoice,
    status: InvoiceStatus,
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
    db.commit()
    db.refresh(db_invoice)

    return db_invoice