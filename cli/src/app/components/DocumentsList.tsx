import { Document } from "@/app/types/document.types";
import Link from "next/link";
import DeleteDocumentButton from "./DeleteDocumentButton";

async function fetchDocuments(): Promise<Document[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  console.log(`[DocumentsList] Fetching from: ${baseUrl}`);

  const response = await fetch(`${baseUrl}/api/document/documents/0/10`, {
    next: { tags: ["documents"] },
    cache: "no-store", // Ensure we always get the latest list
  });
  if (!response.ok) throw new Error("Failed to fetch documents");
  return response.json();
}

export default async function DocumentsList() {
  try {
    const documents = await fetchDocuments();

    if (!documents || documents.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 rounded-2xl border border-dashed border-border bg-muted/20 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">Your library is empty</p>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Upload your first PDF on the left to start exploring AI insights.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc) => {
          const isNew =
            doc.uploaded_at &&
            new Date().getTime() - new Date(doc.uploaded_at).getTime() <
              24 * 60 * 60 * 1000;

          return (
            <div
              key={doc.id}
              className="group relative flex items-center justify-between p-5 rounded-2xl border border-border bg-card/40 hover:bg-card hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  {isNew && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
                  )}
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                      {doc.original_name || "Untitled Document"}
                    </h3>
                    {isNew && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="4"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {doc.uploaded_at &&
                        new Date(doc.uploaded_at).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                    </span>
                    {doc.description && (
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {doc.description}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <Link
                  href={`/document/${doc.id}`}
                  className="h-10 px-4 flex items-center justify-center rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Analyze
                </Link>
                <div className="w-px h-6 bg-border mx-1" />
                <DeleteDocumentButton documentId={doc.id} />
              </div>
            </div>
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return (
      <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="font-bold">Sync Failed</p>
            <p className="text-sm opacity-80">
              We couldn&apos;t reach the document library.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
