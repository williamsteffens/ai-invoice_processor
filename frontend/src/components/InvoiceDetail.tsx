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

function InfoItem({
    label,
    value,
}: InfoItemProps) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-sm text-gray-900">
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
        <div className="flex items-center justify-between">
            <span
                className={
                    strong
                        ? "font-semibold text-gray-900"
                        : "text-gray-600"
                }
            >
                {label}
            </span>

            <span
                className={
                    strong
                        ? "font-semibold text-gray-900"
                        : "text-gray-900"
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
        <div className="fixed inset-0 z-40 overflow-y-auto bg-black/40 p-4">
            <div className="mx-auto my-8 w-full max-w-5xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Invoice {invoice.invoice_number}
                            </h1>

                            <StatusBadge status={invoice.status} />
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                            {invoice.supplier_name}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                        aria-label="Close invoice details"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-8 px-6 py-6">
                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Invoice information
                        </h2>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Supplier
                        </h2>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

                    {invoice.validation_errors?.length > 0 && (
                        <section className="rounded-xl border border-red-200 bg-red-50 p-5">
                            <h2 className="font-semibold text-red-900">
                                Validation issues
                            </h2>

                            <ul className="mt-3 space-y-2 text-sm text-red-800">
                                {invoice.validation_errors.map(
                                    (error, index) => (
                                        <li
                                            key={`${error.field}-${index}`}
                                        >
                                            <span className="font-medium">
                                                {error.field}:
                                            </span>{" "}
                                            {error.message}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Line items
                        </h2>

                        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-500">
                                                Description
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium text-gray-500">
                                                Quantity
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium text-gray-500">
                                                Unit price
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium text-gray-500">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {invoice.line_items.map(
                                            (item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3 text-gray-900">
                                                        {item.description}
                                                    </td>

                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="px-4 py-3 text-right text-gray-600">
                                                        {formatAmount(
                                                            item.unit_price,
                                                            invoice.currency,
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                        {formatAmount(
                                                            item.total,
                                                            invoice.currency,
                                                        )}
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="flex justify-end">
                        <div className="w-full max-w-sm space-y-3 text-sm">
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

                            <div className="border-t border-gray-200 pt-3">
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

                    {!isReviewing && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onStartReview}
                                disabled={loading}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Review invoice
                            </button>
                        </div>
                    )}

                    {isReviewing && (
                        <InvoiceReview
                            status={invoice.status}
                            note={reviewNote}
                            isSaving={loading}
                            onReview={onReview}
                        />
                    )}

                    {invoice.reviewed_at && (
                        <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                            Reviewed at{" "}
                            {new Date(
                                invoice.reviewed_at,
                            ).toLocaleString()}
                        </div>
                    )}

                    {invoice.review_note && (
                        <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
                            Review note:{" "}
                            {invoice.review_note}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={loading}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Delete invoice
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
