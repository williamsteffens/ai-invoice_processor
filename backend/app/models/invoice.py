from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class InvoiceModel(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    invoice_number: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    supplier_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    supplier_vat_number: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    invoice_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    due_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
    )

    subtotal: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    vat: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    total: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    reviewed_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    review_note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    line_items: Mapped[list["InvoiceLineItemModel"]] = relationship(
        back_populates="invoice",
        cascade="all, delete-orphan",
    )

    validation_errors: Mapped[list["InvoiceValidationErrorModel"]] = relationship(
        back_populates="invoice",
        cascade="all, delete-orphan",
    )


class InvoiceLineItemModel(Base):
    __tablename__ = "invoice_line_items"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id"),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    quantity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    unit_price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    total: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    invoice: Mapped[InvoiceModel] = relationship(
        back_populates="line_items",
    )


class InvoiceValidationErrorModel(Base):
    __tablename__ = "invoice_validation_errors"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    invoice_id: Mapped[int] = mapped_column(
        ForeignKey("invoices.id"),
        nullable=False,
    )

    message: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    invoice: Mapped[InvoiceModel] = relationship()
