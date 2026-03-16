"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "../utils/api";

interface DeleteDocumentButtonProps {
  documentId: number;
  redirectHome?: boolean;
}

export default function DeleteDocumentButton({
  documentId,
  redirectHome = false,
}: DeleteDocumentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/api/document/${documentId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      if (redirectHome) {
        router.push("/");
      } else {
        router.refresh(); // Refresh the server components
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
      title="Delete Document"
    >
      {isDeleting ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      )}
    </button>
  );
}
