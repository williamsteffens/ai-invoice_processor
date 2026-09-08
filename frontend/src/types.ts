export type InvoiceStatus =
    | "approved"
    | "needs_review"
    | "rejected"
    | "failed";

export interface Supplier {
    name: string;
    vat_number: string | null;
}

export interface LineItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface Invoice {
    invoice_number: string;
    supplier: Supplier;
    invoice_date: string;
    due_date: string | null;
    currency: string;
    subtotal: number;
    vat: number;
    total: number;
    line_items: LineItem[];
}

export interface InvoiceProcessingResponse {
    status: InvoiceStatus;
    validation_errors: ValidationError[];
    invoice: Invoice;
}

export interface InvoiceListItem {
    id: number;
    invoice_number: string;
    supplier_name: string;
    supplier_vat_number: string | null;
    invoice_date: string;
    due_date: string | null;
    currency: string;
    subtotal: number;
    vat: number;
    total: number;
    status: InvoiceStatus;
}

export interface InvoiceDetail {
    id: number;
    invoice_number: string;
    supplier_name: string;
    supplier_vat_number: string | null;
    invoice_date: string;
    due_date: string | null;
    currency: string;
    subtotal: number;
    vat: number;
    total: number;
    status: InvoiceStatus;
    reviewed_at: string | null;
    review_note: string | null;
    line_items: LineItem[];
    validation_errors: ValidationError[];
}