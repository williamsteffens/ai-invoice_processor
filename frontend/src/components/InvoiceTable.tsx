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
                                onClick={() => onSelect(invoice)}
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
                                    {formatAmount(
                                        invoice.total,
                                        invoice.currency,
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    <StatusBadge
                                        status={invoice.status}
                                    />
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
    );
}
