import { useEffect, useState } from "react";
import type { InvoiceStatus } from "../types";

interface InvoiceReviewProps {
    status: InvoiceStatus;
    note: string;
    isSaving: boolean;
    onReview: (
        status: InvoiceStatus,
        note: string,
    ) => void;
}

const statusOptions: {
    value: InvoiceStatus;
    label: string;
    description: string;
}[] = [
    {
        value: "approved",
        label: "Approved",
        description: "Invoice looks correct",
    },
    {
        value: "needs_review",
        label: "Needs review",
        description: "Something needs attention",
    },
    {
        value: "rejected",
        label: "Rejected",
        description: "Invoice should not be processed",
    },
];

export default function InvoiceReview({
    status,
    note,
    isSaving,
    onReview,
}: InvoiceReviewProps) {
    const [reviewStatus, setReviewStatus] =
        useState<InvoiceStatus>(status);

    const [reviewNote, setReviewNote] = useState(note);

    useEffect(() => {
        setReviewStatus(status);
        setReviewNote(note);
    }, [status, note]);

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        onReview(
            reviewStatus,
            reviewNote.trim(),
        );
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 11.5 11 13.5l4-4M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                            />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Human review
                        </h2>

                        <p className="mt-0.5 text-sm text-gray-500">
                            Confirm the extracted data and record your
                            decision.
                        </p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-5 sm:p-6"
            >
                {/* Status */}
                <div>
                    <div className="mb-3">
                        <label className="text-sm font-semibold text-gray-900">
                            Review status
                        </label>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Select the outcome of your review.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {statusOptions.map((option) => {
                            const selected =
                                reviewStatus === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() =>
                                        setReviewStatus(option.value)
                                    }
                                    className={[
                                        "relative rounded-xl border p-4 text-left transition-all",
                                        "focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2",
                                        selected
                                            ? "border-gray-900 bg-gray-50 shadow-sm"
                                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
                                        isSaving
                                            ? "cursor-not-allowed opacity-60"
                                            : "",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div
                                            className={[
                                                "flex h-8 w-8 items-center justify-center rounded-lg",
                                                option.value === "approved"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : option.value ===
                                                        "rejected"
                                                      ? "bg-red-50 text-red-600"
                                                      : "bg-amber-50 text-amber-600",
                                            ].join(" ")}
                                        >
                                            {option.value ===
                                                "approved" && (
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-7.25 7.5a.75.75 0 0 1-1.08.01l-3.75-4a.75.75 0 1 1 1.092-1.02l3.214 3.427 6.706-6.937a.75.75 0 0 1 1.062-.006Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}

                                            {option.value ===
                                                "needs_review" && (
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-11.25a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .75-.75ZM10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}

                                            {option.value ===
                                                "rejected" && (
                                                <svg
                                                    className="h-4 w-4"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.72 4.72a.75.75 0 0 1 1.06 0L10 8.94l4.22-4.22a.75.75 0 1 1 1.06 1.06L11.06 10l4.22 4.22a.75.75 0 1 1-1.06 1.06L10 11.06l-4.22 4.22a.75.75 0 1 1-1.06-1.06L8.94 10 4.72 5.78a.75.75 0 0 1 0-1.06Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </div>

                                        {selected && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white">
                                                <svg
                                                    className="h-3 w-3"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-7.25 7.5a.75.75 0 0 1-1.08.01l-3.75-4a.75.75 0 1 1 1.092-1.02l3.214 3.427 6.706-6.937a.75.75 0 0 1 1.062-.006Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-gray-900">
                                        {option.label}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        {option.description}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Note */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <label
                            htmlFor="review-note"
                            className="text-sm font-semibold text-gray-900"
                        >
                            Review note
                        </label>

                        <span className="text-xs text-gray-400">
                            Optional
                        </span>
                    </div>

                    <textarea
                        id="review-note"
                        value={reviewNote}
                        onChange={(event) =>
                            setReviewNote(event.target.value)
                        }
                        disabled={isSaving}
                        rows={4}
                        placeholder="Add context about your decision..."
                        className="block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                        A short explanation can help with future audits
                        and reviews.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                    <p className="hidden text-xs text-gray-400 sm:block">
                        Your decision will be saved to this invoice.
                    </p>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="ml-auto inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    <path
                                        className="opacity-90"
                                        d="M21 12a9 9 0 0 1-9 9"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                Save review
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
                            </>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}
