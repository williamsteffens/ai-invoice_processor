import { useEffect, useState } from "react";

import InvoiceDetail from "./components/InvoiceDetail";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceUpload from "./components/InvoiceUpload";

import {
    getInvoice,
    getInvoices,
    uploadInvoice,
    updateInvoiceStatus,
    deleteInvoice,
} from "./api";

import type {
    InvoiceDetail as InvoiceDetailType,
    InvoiceListItem,
    InvoiceStatus,
} from "./types";


export default function App() {
    const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetailType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewNote, setReviewNote] = useState("");

    async function loadInvoices() {
        try {
            setError(null);

            const data = await getInvoices();

            setInvoices(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load invoices",
            );
        }
    }

    useEffect(() => {
        void loadInvoices();
    }, []);

    async function handleUpload() {
        if (!selectedFile || loading) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await uploadInvoice(selectedFile);

            setSelectedFile(null);

            await loadInvoices();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to process invoice",
            );
        } finally {
            setLoading(false);
        }
    }

    async function openInvoice(
        invoice: InvoiceListItem,
    ) {
        try {
            setError(null);

            const detail = await getInvoice(
                invoice.id,
            );

            setSelectedInvoice(detail);
            setReviewNote(
                detail.review_note ?? "",
            );

            // Open details, but don't start review automatically.
            setIsReviewing(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load invoice",
            );
        }
    }

    function startReview() {
        if (!selectedInvoice) {
            return;
        }

        setReviewNote(
            selectedInvoice.review_note ?? "",
        );

        setIsReviewing(true);
    }

    async function handleReview(
        status: InvoiceStatus,
        note: string,
    ) {
        if (!selectedInvoice || loading) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await updateInvoiceStatus(
                selectedInvoice.id,
                status,
                note,
            );

            const updated = await getInvoice(
                selectedInvoice.id,
            );

            setSelectedInvoice(updated);
            setReviewNote(
                updated.review_note ?? "",
            );

            setIsReviewing(false);

            await loadInvoices();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to review invoice",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!selectedInvoice || loading) {
            return;
        }

        const confirmed = window.confirm(
            `Delete invoice ${selectedInvoice.invoice_number}?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await deleteInvoice(
                selectedInvoice.id,
            );

            setSelectedInvoice(null);
            setReviewNote("");
            setIsReviewing(false);

            await loadInvoices();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete invoice",
            );
        } finally {
            setLoading(false);
        }
    }

    function closeInvoice() {
        if (loading) {
            return;
        }

        setSelectedInvoice(null);
        setReviewNote("");
        setIsReviewing(false);
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        AI Invoice Processor
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Upload, extract, validate and review invoices.
                    </p>
                </header>

                <InvoiceUpload
                    selectedFile={selectedFile}
                    loading={loading}
                    error={error}
                    onFileChange={setSelectedFile}
                    onUpload={handleUpload}
                />

                {selectedInvoice && (
                    <InvoiceDetail
                        invoice={selectedInvoice}
                        loading={loading}
                        isReviewing={isReviewing}
                        reviewNote={reviewNote}
                        onClose={closeInvoice}
                        onDelete={handleDelete}
                        onStartReview={startReview}
                        onReview={handleReview}
                    />
                )}

                <InvoiceTable
                    invoices={invoices}
                    onSelect={openInvoice}
                />
            </div>
        </main>
    );
}