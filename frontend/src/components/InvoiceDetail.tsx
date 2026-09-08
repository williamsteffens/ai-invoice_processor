import InvoiceReview from "./InvoiceReview";
import StatusBadge from "./StatusBadge";
import type {
    InvoiceDetail as InvoiceDetailType,
    InvoiceStatus,
} from "../types";
import { formatAmount } from "../utils/formatAmount";

interface InfoItemProps {
    label: string;
    value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {label}
            </p>
            <p className="mt-1.5 truncate text-sm font-medium text-gray-900">
                {value}
            </p>
        </div>
    );
}

interface TotalRowProps {
    label: string;
    value: string;
    strong?: boolean;
}

function TotalRow({
    label,
    value,
    strong = false,
}: TotalRowProps) {
    return (
        <div
            className={`flex items-center justify-between ${
                strong ? "text-base" : "text-sm"
            }`}
        >
            <span
                className={
                    strong
                        ? "font-semibold text-gray-900"
                        : "text-gray-500"
                }
            >
                {label}
            </span>

            <span
                className={
                    strong
                        ? "font-bold text-gray-900"
                        : "font-medium text-gray-800"
                }
            >
                {value}
            </span>
        </div>
    );
}

interface InvoiceDetailProps {
    invoice: InvoiceDetailType;
    loading: boolean;
    isReviewing: boolean;
    reviewNote: string;
    onClose: () => void;
    onDelete: () => void;
    onStartReview: () => void;
    onReview: (
        status: InvoiceStatus,
        note: string,
    ) => void;
}

export default function InvoiceDetail({
    invoice,
    loading,
    isReviewing,
    reviewNote,
    onClose,
    onDelete,
    onStartReview,
    onReview,
}: InvoiceDetailProps) {
    return (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-gray-950/50 p-4 backdrop-blur-sm sm:p-6">
            <div className="mx-auto my-4 w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:my-8">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-4.828-4.828A2 2 0 0 0 12.172 2H7Zm5 1.5L17.5 9H14a2 2 0 0 1-2-2V3.5Z" />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h1 className="truncate text-xl font-bold tracking-tight text-gray-900">
                                            {invoice.invoice_number}
                                        </h1>

                                        <StatusBadge status={invoice.status} />
                                    </div>

                                    <p className="mt-0.5 truncate text-sm text-gray-500">
                                        {invoice.supplier_name}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Close invoice details"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.72 4.72a.75.75 0 0 1 1.06 0L10 8.94l4.22-4.22a.75.75 0 1 1 1.06 1.06L11.06 10l4.22 4.22a.75.75 0 1 1-1.06 1.06L10 11.06l-4.22 4.22a.75.75 0 0 1-1.06-1.06L8.94 10 4.72 5.78a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="space-y-8 px-6 py-7 sm:px-8">
                    {/* Invoice summary */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-gray-900">
                                Invoice information
                            </h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Key details extracted from the invoice.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <InfoItem
                                label="Invoice number"
                                value={invoice.invoice_number}
                            />
                            <InfoItem
                                label="Invoice date"
                                value={invoice.invoice_date || "—"}
                            />
                            <InfoItem
                                label="Due date"
                                value={invoice.due_date || "—"}
                            />
                            <InfoItem
                                label="Currency"
                                value={invoice.currency}
                            />
                        </div>
                    </section>

                    {/* Supplier */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-gray-900">
                                Supplier
                            </h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Supplier identification details.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <InfoItem
                                label="Name"
                                value={invoice.supplier_name}
                            />
                            <InfoItem
                                label="VAT number"
                                value={
                                    invoice.supplier_vat_number ?? "—"
                                }
                            />
                        </div>
                    </section>

                    {/* Validation issues */}
                    {invoice.validation_errors?.length > 0 && (
                        <section className="overflow-hidden rounded-xl border border-red-200 bg-red-50">
                            <div className="flex items-start gap-3 border-b border-red-100 px-5 py-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM9.25 6.75a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-1.5 0v-4.5ZM10 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="font-semibold text-red-900">
                                        Validation issues
                                    </h2>
                                    <p className="mt-0.5 text-sm text-red-700">
                                        Please review the following fields.
                                    </p>
                                </div>
                            </div>

                            <ul className="divide-y divide-red-100">
                                {invoice.validation_errors.map(
                                    (error, index) => (
                                        <li
                                            key={`${error.field}-${index}`}
                                            className="px-5 py-3 text-sm text-red-800"
                                        >
                                            <span className="font-semibold">
                                                {error.field}
                                            </span>
                                            <span className="mx-2 text-red-300">
                                                •
                                            </span>
                                            {error.message}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </section>
                    )}

                    {/* Line items */}
                    <section>
                        <div className="mb-4 flex items-end justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Line items
                                </h2>
                                <p className="mt-0.5 text-sm text-gray-500">
                                    Items included on this invoice.
                                </p>
                            </div>

                            <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 sm:block">
                                {invoice.line_items.length}{" "}
                                {invoice.line_items.length === 1
                                    ? "item"
                                    : "items"}
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/70">
                                            <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Description
                                            </th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Quantity
                                            </th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Unit price
                                            </th>
                                            <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {invoice.line_items.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="transition-colors hover:bg-gray-50/60"
                                            >
                                                <td className="px-5 py-4 font-medium text-gray-900">
                                                    {item.description}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums text-gray-500">
                                                    {item.quantity}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums text-gray-500">
                                                    {formatAmount(
                                                        item.unit_price,
                                                        invoice.currency,
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums text-gray-900">
                                                    {formatAmount(
                                                        item.total,
                                                        invoice.currency,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Totals */}
                    <section className="flex justify-end">
                        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-gray-50/60 p-5">
                            <div className="space-y-3">
                                <TotalRow
                                    label="Subtotal"
                                    value={formatAmount(
                                        invoice.subtotal,
                                        invoice.currency,
                                    )}
                                />

                                <TotalRow
                                    label="VAT"
                                    value={formatAmount(
                                        invoice.vat,
                                        invoice.currency,
                                    )}
                                />

                                <div className="my-3 border-t border-gray-200" />

                                <TotalRow
                                    label="Total"
                                    value={formatAmount(
                                        invoice.total,
                                        invoice.currency,
                                    )}
                                    strong
                                />
                            </div>
                        </div>
                    </section>

                    {/* Review */}
                    <section className="border-t border-gray-100 pt-7">
                        {!isReviewing && (
                            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        Invoice review
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Review this invoice and record your
                                        decision.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={onStartReview}
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Review invoice
                                    <svg
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 10a.75.75 0 0 1 .75-.75h10.69l-3.22-3.22a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H3.75A.75.75 0 0 1 3 10Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {isReviewing && (
                            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                                <InvoiceReview
                                    status={invoice.status}
                                    note={reviewNote}
                                    isSaving={loading}
                                    onReview={onReview}
                                />
                            </div>
                        )}

                        {invoice.reviewed_at && (
                            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                                Reviewed{" "}
                                {new Date(
                                    invoice.reviewed_at,
                                ).toLocaleString()}
                            </div>
                        )}

                        {invoice.review_note && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Review note
                                </p>
                                <p className="mt-2 text-sm leading-6 text-gray-700">
                                    {invoice.review_note}
                                </p>
                            </div>
                        )}
                    </section>
                </main>

                {/* Footer */}
                <footer className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-6 py-4 sm:px-8">
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.5 2.75A1.75 1.75 0 0 0 6.75 4.5V5H4a.75.75 0 0 0 0 1.5h.5v9A1.75 1.75 0 0 0 6.25 17.25h7.5a1.75 1.75 0 0 0 1.75-1.75v-9H16a.75.75 0 0 0 0-1.5h-2.75v-.5a1.75 1.75 0 0 0-1.75-1.75h-3ZM8.25 5v-.5a.25.25 0 0 1 .25-.25h3a.25.25 0 0 1 .25.25V5h-3.5ZM8 8a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5A.75.75 0 0 1 8 8Zm4 0a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5A.75.75 0 0 1 12 8Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Delete invoice
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
}
