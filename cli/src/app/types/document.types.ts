export  interface Document {
    id: number;
    original_name: string;
    uploaded_at: string;
    description?: string;
}

// Define the type for the hook's input
export type UseDocumentUploadOptions = {
    onUploadSuccess?: (file: File) => void;
    onUploadError?: (error: Error) => void;
};

// Define the type for the hook's output
export type UseDocumentUploadResult = {
    uploadFile: (file: File) => Promise<void>;
    uploading: boolean;
    error: Error | null;
};

export type DocumentId = number

export interface SemanticSearch {
    documentId: DocumentId
    query: string
}

export interface SemanticSearchResult {
    id: number;
    content: string;
    page_number: number;
    similarity: number;
  }

export type SemanticSearchError = { data: null; error: Error; isLoading: boolean };

export type SemanticSearchResponse = SemanticSearchResult[] | SemanticSearchError;