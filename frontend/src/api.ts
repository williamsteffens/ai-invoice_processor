import type {
    InvoiceDetail,
    InvoiceListItem,
    InvoiceProcessingResponse,
} from "./types";

const API_URL = "http://localhost:8000/api";

export async function getInvoice(
    invoiceId: number
): Promise<InvoiceDetail> {
    const response = await fetch(`${API_URL}/invoices/${invoiceId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch invoice");
    }

    return response.json();
}

export async function getInvoices(): Promise<InvoiceListItem[]> {
    const response = await fetch(`${API_URL}/invoices`);

    if (!response.ok) {
        throw new Error("Failed to fetch invoices");
    }

    return response.json();
}

export async function uploadInvoice(
    file: File,
): Promise<InvoiceProcessingResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${API_URL}/invoices`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail ?? "Failed to process invoice");
    }

    return response.json();
}

export async function updateInvoiceStatus(
    id: number,
    status: "approved" | "needs_review" | "rejected" | "failed",
    note?: string,
) {
    const response = await fetch(
        `${API_URL}/invoices/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status,
                note,
            }),
        },
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.detail ?? "Failed to update invoice",
        );
    }

    return response.json();
}