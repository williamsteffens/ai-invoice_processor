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
        <section className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
                Human review
            </h2>

            <p className="mt-1 text-sm text-gray-600">
                Review the extracted invoice data and update
                its status if necessary.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4"
            >
                <div>
                    <label
                        htmlFor="review-status"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="review-status"
                        value={reviewStatus}
                        onChange={(event) =>
                            setReviewStatus(
                                event.target.value as InvoiceStatus,
                            )
                        }
                        disabled={isSaving}
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
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
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="review-note"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Review note
                    </label>

                    <textarea
                        id="review-note"
                        value={reviewNote}
                        onChange={(event) =>
                            setReviewNote(event.target.value)
                        }
                        disabled={isSaving}
                        rows={4}
                        placeholder="Add a note about this review..."
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save review"}
                    </button>
                </div>
            </form>
        </section>
    );
}