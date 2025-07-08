"use client";

import { useState, useRef } from 'react';
import useDocumentUpload from "@/app/hooks/useDocumentUpload";

export default function DocumentUpload() {
    const { uploadFile, uploading, error } = useDocumentUpload({
        onUploadSuccess: (file) => {
            console.log('File uploaded successfully:', file.name);
        },
        onUploadError: (error) => {
            console.error('File upload failed:', error.message);
        },
    });
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        } else {
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (file) {
            await uploadFile(file);
            // Clear the input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // This resets the input
            }
            setFile(null); // Clear state
        } else {
            console.warn('No file selected');
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex items-center gap-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
            />
            <button
                onClick={handleButtonClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Select File
            </button>
            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <span>{file ? file.name : 'No file selected'}</span>
        </div>
    );
}