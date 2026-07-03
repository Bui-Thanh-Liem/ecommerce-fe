import { ragServices } from "@/services/chatbot/rag.service"
import { QueryDto } from "@/shared/dtos/common/query.dto"
import { DocumentType } from "@/shared/types/document.type"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useIngestDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ file, type }: { file: File; type: DocumentType }) =>
      ragServices.ingestDocument(file, type),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rag-documents"] })
    },
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    //
    mutationFn: ({ id, type }: { id: string; type: DocumentType }) =>
      ragServices.deleteDocument(id, type),

    //
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rag-documents"] })
    },
  })
}

export const useFindAllRagDocuments = (
  type: DocumentType,
  query?: QueryDto
) => {
  return useQuery({
    queryKey: ["rag-documents"],
    queryFn: () => ragServices.findAll(type, query),
  })
}
