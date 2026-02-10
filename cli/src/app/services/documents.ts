import { SearchProps, SemanticSearchResult } from "../types/document.types";

// Helper to extract error message
async function getErrorMessage(response: Response): Promise<string> {
  try {
    const errorData = await response.json();
    if (errorData && errorData.message) {
      return Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message;
    }
  } catch {
    // ignore JSON parse error
  }
  try {
    const text = await response.text();
    if (text) return text;
  } catch {
    // ignore text read error
  }
  return `HTTP error! status: ${response.status}`;
}

export async function documentSearch({
  documentId,
  query,
}: SearchProps): Promise<SemanticSearchResult[]> {
  try {
    const response = await fetch(
      `http://localhost:3000/api/document/${documentId}/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      },
    );
    if (!response.ok) {
      const message = await getErrorMessage(response);
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
}

export async function documentAnalyze({
  documentId,
  query,
}: SearchProps): Promise<string> {
  try {
    const response = await fetch(
      `http://localhost:3000/api/document/${documentId}/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      },
    );
    if (!response.ok) {
      const message = await getErrorMessage(response);
      throw new Error(message);
    }
    return await response.text();
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
}
