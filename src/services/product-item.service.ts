import {
  CreateProductItemDto,
  UpdateProductItemDto,
} from "@/shared/dtos/req/product-item.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IProductItem } from "@/shared/interfaces/models/product-item.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const productItemServices = {
  create: async (payload: CreateProductItemDto) => {
    const res = await apiCall("/product-items", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async () => {
    const res = await apiCall<ResMetadataDto<IProductItem>>("/product-items", {
      method: "GET",
    })

    return handleResponse<ResMetadataDto<IProductItem>>(res)
  },

  update: async (id: string, payload: UpdateProductItemDto) => {
    const res = await apiCall(`/product-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/product-items/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
