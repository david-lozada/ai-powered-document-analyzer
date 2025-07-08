// app/document-search/page.tsx (or your component file)
import DocumentUpload from './components/DocumentUpload';
import DocumentSearch from './components/DocumentSearch';
import DocumentsList from "@/app/components/DocumentsList";

export default function DocumentSearchPage() {

  return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-10 md:flex-row md:gap-6">

        <section className="p-4 border w-fit border-gray-600 rounded-lg bg-gray-700">
            <h1 className="text-2xl font-bold mb-6">Document Upload</h1>
          <DocumentUpload />
        </section>
          <section className="p-4 border border-gray-600 rounded-lg bg-gray-700">
              <h2 className="text-xl font-semibold mb-4">Documents</h2>
              <DocumentsList/>
          </section>

      </div>
  );
}