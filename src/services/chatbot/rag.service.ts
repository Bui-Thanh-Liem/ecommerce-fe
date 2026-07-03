import { QueryDto } from "@/shared/dtos/common/query.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IRagDocument } from "@/shared/interfaces/models/chatbot/rag-document.interface"
import { DocumentType } from "@/shared/types/document.type"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const ragServices = {
  ingestDocument: async (file: File, type: DocumentType) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await apiCall<IRagDocument>(
      `/rag/ingest-document/${type}`,
      {
        method: "POST",
        body: formData,
      }
    )
    return handleResponse<IRagDocument>(response)
  },

  deleteDocument: async (id: string, type: DocumentType) => {
    const response = await apiCall(`/chatbot-document/${type}/${id}`, {
      method: "DELETE",
    })
    return handleResponse(response)
  },

  findAll: async (type: DocumentType, query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IRagDocument>>(
      `/chatbot-document/${type}?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IRagDocument>>(res)
  },
}
