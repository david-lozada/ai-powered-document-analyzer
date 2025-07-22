import { useRef, useState } from "react";
import { documentAnalyze, documentSearch } from "../services/documents";
import { SemanticSearchResult } from "../types/document.types";

function useForm({ documentId }: { documentId: number }) {
    const askAiRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResponse, setSearchResponse] = useState<SemanticSearchResult | null>(null);
    const [analysisResponse, setAnalysisResponse] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        setError(null);
        setSearchResponse(null);  // Clear previous results
        setAnalysisResponse(null); // Clear previous results
        
        const askAi = askAiRef.current?.checked;
        const question = textareaRef.current?.value;

        if (!question) {
            setError("Please enter a question.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (askAi) {
                const response = await documentAnalyze({ documentId, query: question });
                setAnalysisResponse(response)
            } else {
                const response = await documentSearch({ documentId, query: question });
                setSearchResponse(response)
            }
        } catch (err) {
            setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setIsSubmitting(false);
            if (textareaRef.current) {
                textareaRef.current.value = "";
            }
        }
    };

    return {
        handleSubmit,
        askAiRef,
        textareaRef,
        isSubmitting,
        error,
        searchResponse,
        analysisResponse
    };
}

export default useForm;