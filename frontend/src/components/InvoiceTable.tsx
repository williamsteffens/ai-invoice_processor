import type { InvoiceListItem } from "../types";
import StatusBadge from "./StatusBadge";
import { formatAmount } from "../utils/formatAmount";


interface InvoiceTableProps {
    invoices: InvoiceListItem[];
    onSelect: (invoice: InvoiceListItem) => void;
}

export default function InvoiceTable({
    invoices,
    onSelect,
}: InvoiceTableProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                        Invoices
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Review and manage your processed invoices.
                    </p>
                </div>

                {invoices.length > 0 && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        {invoices.length}{" "}
                        {invoices.length === 1 ? "invoice" : "invoices"}
                    </span>
                )}
            </div>

            {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/70">
                                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Invoice
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Supplier
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Date
                                </th>
                                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Total
                                </th>
                                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Status
                                </th>
                                <th className="w-12 px-4" />
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {invoices.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    onClick={() => onSelect(invoice)}
                                    className="group cursor-pointer transition-colors hover:bg-gray-50/80"
                                >
                                    {/* Invoice */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                                                <svg
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-4.828-4.828A2 2 0 0 0 12.172 2H7Zm5 1.5L17.5 9H14a2 2 0 0 1-2-2V3.5ZM8 13h1.75c1.38 0 2.25.72 2.25 1.9s-.87 1.9-2.25 1.9H9.5V19H8v-6Zm1.5 1.2v1.4h.7c.5 0 .8-.25.8-.7s-.3-.7-.8-.7h-.7ZM13 13h2.05c1.8 0 2.95 1.1 2.95 3s-1.15 3-2.95 3H13v-6Zm1.5 1.3v3.4h.45c.95 0 1.55-.55 1.55-1.7s-.6-1.7-1.55-1.7h-.45Z" />
                                                </svg>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {invoice.invoice_number}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-400">
                                                    Invoice
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Supplier */}
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700">
                                            {invoice.supplier_name}
                                        </span>
                                    </td>

                                    {/* Date */}
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                                        {invoice.invoice_date}
                                    </td>

                                    {/* Total */}
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <span className="font-semibold text-gray-900">
                                            {formatAmount(
                                                invoice.total,
                                                invoice.currency,
                                            )}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <StatusBadge status={invoice.status} />
                                    </td>

                                    {/* Arrow */}
                                    <td className="px-4 py-4">
                                        <svg
                                            className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.22 14.78a.75.75 0 0 0 1.06 0l4.5-4.5a.75.75 0 0 0 0-1.06l-4.5-4.5a.75.75 0 1 0-1.06 1.06L11.19 10l-3.97 3.97a.75.75 0 0 0 0 1.06Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                        <svg
                            className="h-7 w-7 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
                            />
                            <path
                                strokeLinecap="round"
                                d="M14 3.5V8h4.5M9 12h6M9 15.5h4"
                            />
                        </svg>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900">
                        No invoices yet
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-gray-500">
                        Process your first invoice and it will appear here.
                    </p>
                </div>
            )}
        </section>
    );
}
