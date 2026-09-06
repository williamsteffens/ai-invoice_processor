from datetime import date

from sqlalchemy import Date, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class InvoiceModel(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    invoice_number: Mapped[str] = mapped_column(String(100), nullable=False)
    supplier_name: Mapped[str] = mapped_column(String(255), nullable=False)
    supplier_vat_number: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    invoice_date: Mapped[date] = mapped_column(Date, nullable=False)
    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    currency: Mapped[str] = mapped_column(String(3), nullable=False)

    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    vat: Mapped[float] = mapped_column(Float, nullable=False)
    total: Mapped[float] = mapped_column(Float, nullable=False)

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )