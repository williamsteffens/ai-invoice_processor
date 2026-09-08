interface InvoiceUploadProps {
    selectedFile: File | null;
    loading: boolean;
    error: string | null;
    onFileChange: (file: File | null) => void;
    onUpload: () => void;
}

export default function InvoiceUpload({
    selectedFile,
    loading,
    error,
    onFileChange,
    onUpload,
}: InvoiceUploadProps) {
    return (
        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                    Upload invoice
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Upload a PDF invoice to extract and process its details.
                </p>
            </div>

            <div className="p-6">
                <label
                    htmlFor="invoice-upload"
                    className={[
                        "group relative flex cursor-pointer flex-col items-center justify-center",
                        "rounded-xl border-2 border-dashed px-6 py-10 text-center",
                        "transition-all duration-200",
                        "hover:border-gray-400 hover:bg-gray-50",
                        loading
                            ? "cursor-not-allowed opacity-60"
                            : "border-gray-200 bg-gray-50/50",
                    ].join(" ")}
                >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-transform group-hover:scale-105">
                        <svg
                            className="h-7 w-7 text-red-500"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path d="M7 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-4.828-4.828A2 2 0 0 0 12.172 2H7Zm5 1.5L17.5 9H14a2 2 0 0 1-2-2V3.5ZM8 13h2.25c1.38 0 2.25.72 2.25 1.9s-.87 1.9-2.25 1.9H9.5V19H8v-6Zm1.5 1.2v1.4h.7c.5 0 .8-.25.8-.7s-.3-.7-.8-.7h-.7Zm4-1.2h2.05c1.8 0 2.95 1.1 2.95 3s-1.15 3-2.95 3H13.5v-6Zm1.5 1.3v3.4h.45c.95 0 1.55-.55 1.55-1.7s-.6-1.7-1.55-1.7H15Z" />
                        </svg>
                    </div>

                    <p className="text-sm font-medium text-gray-900">
                        {selectedFile ? (
                            <>
                                <span className="text-gray-500">Selected </span>
                                {selectedFile.name}
                            </>
                        ) : (
                            <>
                                <span className="text-gray-900">
                                    Click to upload
                                </span>{" "}
                                <span className="font-normal text-gray-500">
                                    or drag and drop
                                </span>
                            </>
                        )}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        PDF files only
                    </p>

                    <input
                        id="invoice-upload"
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={(event) => {
                            onFileChange(
                                event.target.files?.[0] ?? null,
                            );
                        }}
                        disabled={loading}
                        className="sr-only"
                    />
                </label>

                {error && (
                    <div
                        role="alert"
                        className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <svg
                            className="mt-0.5 h-5 w-5 shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={onUpload}
                        disabled={!selectedFile || loading}
                        className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {loading ? (
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
                                Processing...
                            </>
                        ) : (
                            <>
                                Process invoice
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
            </div>
        </section>
    );
}