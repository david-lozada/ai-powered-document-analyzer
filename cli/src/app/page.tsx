import DocumentUpload from "./components/DocumentUpload";
import DocumentsList from "./components/DocumentsList";

export default function DocumentSearchPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12 md:py-20 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen AI Analysis v1.0
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Analyze Documents with <br />
            <span className="gradient-text">AI Powered</span> Precision
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform static PDFs into interactive conversations. Extract
            insights, summarize clauses, and uncover patterns in seconds.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Trusted by <span className="text-foreground font-bold">500+</span>{" "}
            document analysts
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload */}
        <div className="lg:col-span-4 sticky top-6">
          <section className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl font-bold">Import</h2>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                  Step 1: Upload PDF
                </p>
              </div>
            </div>
            <DocumentUpload />
            <div className="p-4 rounded-xl bg-accent/50 border border-border/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                PRO TIP
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                Scanning complex documents? For best results, ensure the PDF has
                a text layer (not just images).
              </p>
            </div>
          </section>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-8">
          <section className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
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
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M10 13h4" />
                    <path d="M10 17h4" />
                    <path d="M10 9h1" />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold">Library</h2>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">
                    Step 2: Start Analysis
                  </p>
                </div>
              </div>
            </div>
            <DocumentsList />
          </section>
        </div>
      </div>
    </div>
  );
}
