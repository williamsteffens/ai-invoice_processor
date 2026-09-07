import { useEffect, useState } from "react";

import {
    getInvoice,
    getInvoices,
    uploadInvoice,
    updateInvoiceStatus,
} from "./api";

import type {
    InvoiceDetail,
    InvoiceListItem
} from "./types";


function App() {
    const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewStatus, setReviewStatus] =
        useState<
            "approved" | "needs_review" | "rejected" | "failed"
        >("approved");
    const [reviewNote, setReviewNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        loadInvoices();
    }, []);

    async function handleUpload() {
        if (!selectedFile) {
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

            const detail = await getInvoice(invoice.id);

            setSelectedInvoice(detail);
            setReviewStatus(
                detail.status as
                | "approved"
                | "needs_review"
                | "rejected"
                | "failed"
            );
            setReviewNote(
                detail.review_note ?? "",
            );
            setIsReviewing(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load invoice",
            );
        }
    }

    async function handleReview() {
        if (!selectedInvoice) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await updateInvoiceStatus(
                selectedInvoice.id,
                reviewStatus,
                reviewNote,
            );

            const updated = await getInvoice(
                selectedInvoice.id,
            );

            setSelectedInvoice(updated);
            setIsReviewing(false);
            setReviewNote("");

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

    function getStatusClasses(status: string) {
        switch (status) {
            case "approved":
                return "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700";

            case "needs_review":
                return "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700";

            case "rejected":
                return "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700";

            case "failed":
                return "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700";

            default:
                return "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700";
        }
    }

    function getStatusLabel(status: string) {
        switch (status) {
            case "approved":
                return "Approved";

            case "needs_review":
                return "Needs review";

            case "rejected":
                return "Rejected";

            case "failed":
                return "Failed";

            default:
                return status;
        }
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

                <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">
                        Upload Invoice
                    </h2>

                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(event) =>
                                setSelectedFile(
                                    event.target.files?.[0] ?? null,
                                )
                            }
                            className="block w-full text-sm"
                        />

                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || loading}
                            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Process"}
                        </button>
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-red-600">
                            {error}
                        </p>
                    )}
                </section>

                {selectedInvoice && (
                    <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {selectedInvoice.invoice_number}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {selectedInvoice.supplier_name}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="rounded-lg border px-4 py-2 text-sm"
                            >
                                Close
                            </button>
                        </div>

                        {selectedInvoice.validation_errors.length > 0 && (
                            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <h3 className="font-semibold text-yellow-800">
                                    Validation issues
                                </h3>

                                <ul className="mt-2 list-disc pl-5 text-sm text-yellow-700">
                                    {selectedInvoice.validation_errors.map(
                                        (error) => (
                                            <li key={error}>{error}</li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="mb-3 font-semibold">
                                Line items
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b text-gray-500">
                                        <tr>
                                            <th className="py-2">Description</th>
                                            <th className="py-2">Qty</th>
                                            <th className="py-2">Unit price</th>
                                            <th className="py-2">Total</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y">
                                        {selectedInvoice.line_items.map(
                                            (item) => (
                                                <tr key={item.id}>
                                                    <td className="py-3">
                                                        {item.description}
                                                    </td>

                                                    <td className="py-3">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="py-3">
                                                        {item.unit_price.toFixed(2)}
                                                    </td>

                                                    <td className="py-3 font-medium">
                                                        {item.total.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mb-6 ml-auto max-w-sm space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                    {selectedInvoice.subtotal.toFixed(2)}{" "}
                                    {selectedInvoice.currency}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>VAT</span>
                                <span>
                                    {selectedInvoice.vat.toFixed(2)}{" "}
                                    {selectedInvoice.currency}
                                </span>
                            </div>

                            <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total</span>
                                <span>
                                    {selectedInvoice.total.toFixed(2)}{" "}
                                    {selectedInvoice.currency}
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            {!isReviewing ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">
                                            Human review
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Manually verify or change the
                                            processing status.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setReviewStatus(
                                                selectedInvoice.status as
                                                | "approved"
                                                | "needs_review"
                                                | "rejected"
                                                | "failed"
                                            );

                                            setReviewNote(
                                                selectedInvoice.review_note ?? "",
                                            );

                                            setIsReviewing(true);
                                        }}
                                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                                    >
                                        Review document
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="mb-4 font-semibold">
                                        Review document
                                    </h3>

                                    <label className="mb-2 block text-sm font-medium">
                                        Status
                                    </label>

                                    <select
                                        value={reviewStatus}
                                        onChange={(event) =>
                                            setReviewStatus(
                                                event.target.value as
                                                | "approved"
                                                | "needs_review"
                                                | "rejected"
                                                | "failed"
                                            )
                                        }
                                        className="mb-4 w-full rounded-lg border p-3 text-sm"
                                    >
                                        <option value="approved">
                                            Approved
                                        </option>

                                        <option value="needs_review">
                                            Needs review
                                        </option>

                                        <option value="rejected">
                                            Rejected
                                        </option>

                                        <option value="failed">
                                            Failed
                                        </option>
                                    </select>

                                    <label className="mb-2 block text-sm font-medium">
                                        Review note
                                    </label>

                                    <textarea
                                        value={reviewNote}
                                        onChange={(event) =>
                                            setReviewNote(event.target.value)
                                        }
                                        placeholder="Add a review note..."
                                        className="mb-4 w-full rounded-lg border p-3 text-sm"
                                        rows={3}
                                    />

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() =>
                                                setIsReviewing(false)
                                            }
                                            disabled={loading}
                                            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleReview}
                                            disabled={loading}
                                            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                                        >
                                            {loading
                                                ? "Saving..."
                                                : "Save status"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedInvoice.reviewed_at && (
                            <div className="border-t pt-4 text-sm text-gray-500">
                                Reviewed:{" "}
                                {new Date(
                                    selectedInvoice.reviewed_at,
                                ).toLocaleString()}
                            </div>
                        )}
                    </section>
                )}

                <section className="rounded-xl bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold">
                            Invoices
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-6 py-3">Invoice</th>
                                    <th className="px-6 py-3">Supplier</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Total</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {invoices.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        onClick={() => openInvoice(invoice)}
                                        className="cursor-pointer hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {invoice.invoice_number}
                                        </td>

                                        <td className="px-6 py-4">
                                            {invoice.supplier_name}
                                        </td>

                                        <td className="px-6 py-4">
                                            {invoice.invoice_date}
                                        </td>

                                        <td className="px-6 py-4">
                                            {invoice.total.toFixed(2)}{" "}
                                            {invoice.currency}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={getStatusClasses(invoice.status)}>
                                                {getStatusLabel(invoice.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {invoices.length === 0 && (
                        <p className="px-6 py-10 text-center text-gray-500">
                            No invoices processed yet.
                        </p>
                    )}
                </section>

            </div>
        </main>
    );
}

export default App;