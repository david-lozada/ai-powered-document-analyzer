"use client";
import useDocument from "@/app/hooks/useDocument";
import useForm from "@/app/hooks/useForm";
import React from "react";
import Link from "next/link";
import DeleteDocumentButton from "@/app/components/DeleteDocumentButton";

export default function DocumentUploadPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const resolvedParams = React.use(params);
  const documentId = resolvedParams.id;
  const { data, error, isLoading } = useDocument({ documentId });
  const {
    handleSubmit,
    askAiRef,
    textareaRef,
    searchResponse,
    analysisResponse,
    isSubmitting,
    error: formError,
  } = useForm({ documentId });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
          </div>
        </div>
        <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase animate-pulse">
          Retrieving Intelligence...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-700">
        <div className="w-24 h-24 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive shadow-2xl shadow-destructive/20 rotate-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
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
        <div className="space-y-3">
          <h1 className="text-3xl font-black italic tracking-tighter">
            Connection Lost
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We encountered a problem while trying to fetch this document's
            brain.
          </p>
        </div>
        <Link
          href="/"
          className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          Return to Hub
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Neural Analysis Mode
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            {data?.original_name || "Document Context"}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Universal pattern matching active. Ask anything about this context.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DeleteDocumentButton documentId={documentId} redirectHome={true} />
          <Link
            href="/"
            className="p-3 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-all text-foreground/70 hover:text-foreground"
            title="Close analysis"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-10 min-h-[40vh]">
        {!searchResponse && !analysisResponse && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-30 animate-float">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="max-w-xs font-bold text-sm tracking-tight leading-relaxed">
              System standby. Waiting for query input to begin cognitive search.
            </p>
          </div>
        )}

        {analysisResponse && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="p-8 rounded-[2.5rem] border border-primary/20 bg-primary/5 space-y-4 shadow-2xl shadow-primary/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest relative z-10">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
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
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                </div>
                AI Synthesis Result
              </div>
              <div className="text-foreground/90 leading-relaxed text-lg font-medium relative z-10 antialiased">
                {analysisResponse}
              </div>
            </div>
          </div>
        )}

        {searchResponse && searchResponse.length > 0 && (
          <div className="space-y-6 animate-in fade-in duration-1000">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em]">
                Verified Source Contexts
              </h2>
              <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/5 border border-primary/10 tracking-widest uppercase">
                {searchResponse.length} Matches found
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {searchResponse.map((result, idx) => (
                <div
                  key={result.id}
                  className="p-6 rounded-3xl border border-border/50 bg-card/40 hover:bg-card hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 space-y-4 group animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-secondary/50 flex items-center justify-center text-muted-foreground font-black text-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      #{idx + 1}
                    </div>
                    <p className="text-foreground/80 italic font-medium leading-relaxed group-hover:text-foreground transition-colors">
                      "{result.content}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/30 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Page {result.page_number}
                      </span>
                      <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Confidence: {Math.round(result.similarity * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000 ease-out"
                        style={{ width: `${result.similarity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Search Bar */}
      <div className="fixed bottom-10 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 w-full max-w-3xl px-4 z-50">
        {formError && (
          <div className="mb-4 p-3 rounded-2xl bg-destructive/80 border border-destructive/20 text-white text-xs font-bold text-center animate-in fade-in slide-in-from-bottom-2 shadow-lg backdrop-blur-xl">
            ⚠️ {formError}
          </div>
        )}
        <form
          className="relative p-3 rounded-[2rem] glass-card shadow-2xl shadow-primary/10 border border-primary/20 flex flex-col gap-3 group focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-500"
          onSubmit={handleSubmit}
        >
          <textarea
            id="textarea"
            className="p-5 pr-14 block w-full bg-transparent border-none focus:ring-0 text-base font-medium placeholder:text-muted-foreground/50 resize-none min-h-[70px] max-h-[250px] leading-relaxed"
            placeholder={
              isSubmitting
                ? "Analyzing document content..."
                : "Ask anything about this document context..."
            }
            ref={textareaRef}
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          ></textarea>

          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer group/toggle">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    ref={askAiRef}
                    id="AI-checkbox"
                    disabled={isSubmitting}
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner transition-colors duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/toggle:text-primary transition-colors">
                    Cognitive Mode
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground/50 hidden md:block">
                    Enable AI interpretation
                  </span>
                </div>
              </label>

              <div className="h-4 w-px bg-border/50 hidden md:block" />
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Shift + Enter for new line
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="p-3.5 rounded-2xl bg-primary text-white hover:scale-110 active:scale-90 transition-all font-black shadow-xl shadow-primary/30 disabled:opacity-50 disabled:scale-100 group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:animate-shimmer" />
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-5 h-5 relative z-10"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="m22 2-7 20-4-9-9-4Z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
