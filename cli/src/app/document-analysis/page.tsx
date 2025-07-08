import DocumentSearch from "@/app/components/DocumentSearch";

export default function DocumentUploadPage() {
    return (
        /* Client-side interactive part */
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Document Analyzer</h1>
            <section className="p-4 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Search Documents</h2>
                <DocumentSearch />
            </section>
        </div>
    )
}