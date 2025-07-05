export interface RawResult {
  id: number;
  content: string;
  page_number: number;
  similarity: number;
}
// Create a new file: document.types.ts
export interface SearchResult extends RawResult {
  document?: {
    id: number;
    name?: string;
  }; // Optional document info if you want to include it
}
