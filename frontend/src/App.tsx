import { useEffect, useState } from "react";

import {
    getInvoices,
    uploadInvoice,
} from "./api";

import type { InvoiceListItem } from "./types";


function App() {
    const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListItem | null>(null);
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
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {selectedInvoice.invoice_number}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Invoice details
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedInvoice(null)}
                                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Supplier
                                </p>

                                <p className="font-medium">
                                    {selectedInvoice.supplier_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    VAT number
                                </p>

                                <p className="font-medium">
                                    {selectedInvoice.supplier_vat_number ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Invoice date
                                </p>

                                <p className="font-medium">
                                    {selectedInvoice.invoice_date}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Due date
                                </p>

                                <p className="font-medium">
                                    {selectedInvoice.due_date ?? "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Subtotal
                                </p>

                                <p className="font-medium">
                                    {selectedInvoice.subtotal.toFixed(2)}{" "}
                                    {selectedInvoice.currency}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    VAT
                                </p>

                                <p className="font-medium">
                                    {selectedInvoice.vat.toFixed(2)}{" "}
                                    {selectedInvoice.currency}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Total
                                </p>

                                <p className="text-lg font-semibold">
                                    {selectedInvoice.total.toFixed(2)}{" "}
                                    {selectedInvoice.currency}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Processing status
                                </p>

                                <span className="font-medium">
                                    {selectedInvoice.status}
                                </span>
                            </div>
                        </div>

                        {selectedInvoice.status === "needs_review" && (
                            <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                                <h3 className="font-semibold text-yellow-800">
                                    Human review required
                                </h3>

                                <p className="mt-1 text-sm text-yellow-700">
                                    This invoice failed one or more validation checks.
                                    Review the extracted values before approving it.
                                </p>
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
                                        onClick={() => setSelectedInvoice(invoice)}
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
                                            <span
                                                className={
                                                    invoice.status === "approved"
                                                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                                        : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700"
                                                }
                                            >
                                                {invoice.status}
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