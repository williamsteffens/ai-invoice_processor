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
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">
                Upload Invoice
            </h2>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(event) => {
                        onFileChange(
                            event.target.files?.[0] ?? null,
                        );
                    }}
                    disabled={loading}
                    className="block w-full text-sm"
                />

                <button
                    type="button"
                    onClick={onUpload}
                    disabled={!selectedFile || loading}
                    className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Process"}
                </button>
            </div>

            {selectedFile && (
                <p className="mt-3 text-sm text-gray-500">
                    Selected: {selectedFile.name}
                </p>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}
        </section>
    );
}