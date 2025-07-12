import { Document } from '@/app/types/document.types';
import Link from "next/link";

async function fetchDocuments(): Promise<Document[]> {
    const response = await fetch('http://localhost:3000/api/document/documents/0/10', {
        next: { tags: ['documents'] }
    });
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
}

export default async function DocumentsList() {
    try {
        const documents = await fetchDocuments();

        return (
            <div className="space-y-4">
                {!documents ? ('There are no documents available. Please upload some documents to get started.') : (documents.map((doc) => (
                    <div key={doc.id} className="flex flex-row justify-between p-4 border rounded-lg shadow-sm">
                        <div className="flex flex-col">
                            <h3 className="font-medium">{doc.original_name || 'Untitled Document'}</h3>
                            {doc.description && (
                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                                {doc.uploaded_at && new Date(doc.uploaded_at).toLocaleDateString()}
                            </div>
                        </div>
                        <div>
                            <Link
                                href={`/document/${doc.id}`}
                                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                )))}
            </div> // TODO: Pagination and sorting
        );
    } catch (error) {
        return (
            <div className="p-4 text-red-500">
                Error: {error instanceof Error ? error.message : 'Failed to load documents'}
            </div>
        );
    }
}