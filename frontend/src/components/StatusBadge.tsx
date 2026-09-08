import type { InvoiceStatus } from "../types";

interface StatusBadgeProps {
    status: InvoiceStatus;
}

function getStatusClasses(status: InvoiceStatus): string {
    switch (status) {
        case "approved":
            return "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700";

        case "needs_review":
            return "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700";

        case "rejected":
            return "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700";

        case "failed":
            return "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700";
    }
}

function getStatusLabel(status: InvoiceStatus): string {
    switch (status) {
        case "approved":
            return "Approved";

        case "needs_review":
            return "Needs review";

        case "rejected":
            return "Rejected";

        case "failed":
            return "Failed";
    }
}

export default function StatusBadge({
    status,
}: StatusBadgeProps) {
    return (
        <span className={getStatusClasses(status)}>
            {getStatusLabel(status)}
        </span>
    );
}