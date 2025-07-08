import { useState, useCallback } from 'react';
import { UseDocumentUploadOptions, UseDocumentUploadResult } from "@/app/types/document";
import {useRouter} from "next/navigation";

function useDocumentUpload(options: UseDocumentUploadOptions): UseDocumentUploadResult {
    const router = useRouter();
    const { onUploadSuccess, onUploadError } = options;
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const uploadFile = useCallback(async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // 1. Upload the file
            const response = await fetch('http://localhost:3000/api/document/process', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            router.refresh();

            if (onUploadSuccess) {
                onUploadSuccess(file);
            }
        } catch (err) {
            setError(err as Error);
            if (onUploadError) {
                onUploadError(err as Error);
            }
        } finally {
            setUploading(false);
        }
    }, [onUploadSuccess, onUploadError]);

    return { uploadFile, uploading, error };
}

export default useDocumentUpload;