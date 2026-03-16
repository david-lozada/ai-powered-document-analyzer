import useSWR from "swr";
import { Document, DocumentId } from "../types/document.types";
import { getApiBaseUrl } from "../utils/api";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useDocument({ documentId }: { documentId: DocumentId }) {
  const { data, error, isLoading } = useSWR<Document>(
    `${getApiBaseUrl()}/api/document/${documentId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    error,
    isLoading,
  };
}

export default useDocument;
