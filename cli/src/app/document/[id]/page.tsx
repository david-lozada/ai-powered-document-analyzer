"use client";
import useDocument from '@/app/hooks/useDocument';
import useForm from '@/app/hooks/useForm';
import React from 'react';

export default function DocumentUploadPage({ params }: { params: Promise<{ id: number }> }) {
    // Unwrap the params promise
    const resolvedParams = React.use(params);
    const documentId = resolvedParams.id;
    const { data, error, isLoading } = useDocument({ documentId });
    const { handleSubmit, askAiRef, textareaRef, searchResponse, analysisResponse } = useForm({ documentId})

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading document</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {data?.original_name && (
                <h1 className="text-2xl font-bold mb-6">{data.original_name}</h1>
            )}
            <form className="relative w-full max-w-2xl rounded-lg shadow-md" onSubmit={handleSubmit}>
                <textarea 
                    id="textarea" 
                    className="p-3 sm:p-4 pb-12 sm:pb-12 block w-full border-gray-600 rounded-lg bg-gray-700 sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" 
                    placeholder="Ask me anything..." 
                    data-textarea-auto-height=""
                    ref={textareaRef}
                ></textarea>

                <div className="absolute bottom-px inset-x-px p-2 rounded-b-md bg-white">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                id="AI-checkbox"
                                ref={askAiRef}
                            />
                            <label htmlFor="AI-checkbox"
                                   className="text-sm text-gray-500 ms-3 dark:text-neutral-400">Ask AI</label>
                        </div>

                        <div className="flex items-center gap-x-1">
                            <button type="submit"
                                    className="inline-flex shrink-0 justify-center items-center size-8 rounded-lg bg-green-500 hover:bg-green-600 focus:z-10 focus:outline-hidden">
                                <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16"
                                     height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {searchResponse && searchResponse.length > 0 && (
                <div className="mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                    <ul className="space-y-4">
                        {searchResponse.map((result) => (
                            <li key={result.id} className="p-4 bg-gray-800 rounded-lg shadow-md">
                                <h3 className="font-bold">{result.content}</h3>
                                <p className="text-sm text-gray-400">Page: {result.page_number}</p>
                                <p className="text-sm text-gray-400">Similarity: {result.similarity.toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {analysisResponse && (
                <div className="mt-6 w-full max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                    <ul className="space-y-4">
                            <li className="p-4 bg-gray-800 rounded-lg shadow-md">
                                <p className="text-sm text-gray-400">{analysisResponse}</p>
                            </li>
                    </ul>
                </div>
            )}
            
        </div>
    )
}