import { SearchProps, SemanticSearchResult } from "../types/document.types";

export async function documentSearch({documentId, query}: SearchProps): Promise<SemanticSearchResult> {
    try {
        const response = await fetch(`http://localhost:3000/api/document/${documentId}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Search Error:", error);
        throw error;
    }
}

export async function documentAnalyze({documentId, query}: SearchProps): Promise<string> {
    try {
        const response = await fetch(`http://localhost:3000/api/document/${documentId}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Search Error:", error);
        throw error;
    }
}