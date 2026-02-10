"use client";

import { useState, useRef } from "react";
import useDocumentUpload from "@/app/hooks/useDocumentUpload";

export default function DocumentUpload() {
  const { uploadFile, uploading, error } = useDocumentUpload({
    onUploadSuccess: (file) => {
      console.log("File uploaded successfully:", file.name);
      setFile(null);
    },
    onUploadError: (error) => {
      console.error("File upload failed:", error.message);
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

  const handleUpload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file) {
      await uploadFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div
        onClick={handleButtonClick}
        className={`relative border-2 border-dashed rounded-3xl p-10 transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center gap-4 ${
          file
            ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10"
            : "border-border hover:border-primary/40 hover:bg-muted/30 hover:shadow-xl"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            file
              ? "bg-primary text-white scale-110"
              : "bg-primary/10 text-primary group-hover:scale-110"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={uploading ? "animate-pulse" : ""}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <div className="text-center space-y-1">
          <p className="font-bold text-lg group-hover:text-primary transition-colors">
            {file ? file.name : "Select Document"}
          </p>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            PDF documents up to 10MB
          </p>
        </div>

        {file && !uploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all duration-300"
            title="Remove file"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="relative overflow-hidden w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="uppercase tracking-widest text-xs">
              Analyzing...
            </span>
          </>
        ) : (
          <span className="uppercase tracking-widest text-xs">
            Begin Analysis
          </span>
        )}
      </button>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20 text-[11px] text-destructive text-center font-bold animate-in fade-in slide-in-from-top-2">
          {error.message}
        </div>
      )}
    </div>
  );
}
