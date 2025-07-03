// Create a new file: document.types.ts
export interface SearchResult {
  id: number;
  content: string;
  page_number: number;
  similarity: number;
  document?: {
    id: number;
    name?: string;
  }; // Optional document info if you want to include it
}
export type RawResult = {
  chunk_id: number;
  chunk_content: string;
  chunk_page_number: number;
  similarity: number;
};
