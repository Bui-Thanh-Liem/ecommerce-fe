import {
  CreateProductDto,
  UpdateProductDto,
} from "@/shared/dtos/req/product.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IProduct } from "@/shared/interfaces/models/product.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const productServices = {
  create: async (payload: CreateProductDto) => {
    const res = await apiCall("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async () => {
    const res = await apiCall<ResMetadataDto<IProduct>>("/products", {
      method: "GET",
    })

    return handleResponse<ResMetadataDto<IProduct>>(res)
  },

  update: async (id: string, payload: UpdateProductDto) => {
    const res = await apiCall(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/products/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
