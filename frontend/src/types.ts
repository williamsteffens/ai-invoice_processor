export interface Supplier {
  name: string;
  vat_number: string | null;
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

export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface InvoiceProcessingResponse {
  status: string;
  validation_errors: string[];
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
  status: string;
}