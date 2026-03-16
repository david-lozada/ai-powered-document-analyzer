import { SearchProps, SemanticSearchResult } from "../types/document.types";
import { getApiBaseUrl } from "../utils/api";

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
      `${getApiBaseUrl()}/api/document/${documentId}/search`,
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
  model,
}: SearchProps & { model?: string }): Promise<string> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/document/${documentId}/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, model }),
      },
    );
    if (!response.ok) {
      const message = await getErrorMessage(response);
      throw new Error(message);
    }
    return await response.text();
  } catch (error) {
    console.error("Analyze Error:", error);
    throw error;
  }
}

export async function* documentAnalyzeStream({
  documentId,
  query,
  model,
}: SearchProps & { model?: string }): AsyncGenerator<string> {
  const response = await fetch(
    `${getApiBaseUrl()}/api/document/${documentId}/analyze-stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, model }),
    },
  );

  if (!response.ok) {
    const message = await getErrorMessage(response);
    throw new Error(message);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Response body is null");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

      try {
        const json = JSON.parse(trimmedLine.replace("data: ", ""));
        if (json.text) {
          yield json.text;
        }
      } catch (e) {
        console.error("Error parsing stream chunk:", e);
      }
    }
  }
}
