import useSWR from 'swr'
import { Document, DocumentId } from '../types/document.types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function useDocument({ documentId }: {documentId: DocumentId}) {
  const { data, error, isLoading } = useSWR<Document>(
    `http://localhost:3000/api/document/${documentId}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  return {
    data,
    error,
    isLoading
  }
}

export default useDocument