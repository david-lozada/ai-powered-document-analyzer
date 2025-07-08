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