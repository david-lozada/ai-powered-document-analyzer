import { SemanticSearch, SemanticSearchResponse } from '../types/document.types'


function useDocumentSearch() {
  const semanticSearch = async({documentId, query}: SemanticSearch): Promise<SemanticSearchResponse> => {
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
      console.error('Error during semantic search:', error);
      return {
        data: null,
        error: error as Error,
        isLoading: false
      }
        
    }
  }

  return {
    semanticSearch,
  }
}

export default useDocumentSearch