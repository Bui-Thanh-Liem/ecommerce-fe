import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from "@/shared/dtos/req/product-variant.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IProductVariant } from "@/shared/interfaces/models/product-variant.interface"
import { apiCall } from "@/utils/call-api.util"
import { handleResponse } from "@/utils/handle-response.util"

export const productVariantServices = {
  create: async (payload: CreateProductVariantDto) => {
    const res = await apiCall("/product-variants", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  findAll: async () => {
    const res = await apiCall<ResMetadataDto<IProductVariant>>(
      "/product-variants",
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IProductVariant>>(res)
  },

  update: async (id: string, payload: UpdateProductVariantDto) => {
    const res = await apiCall(`/product-variants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })

    return handleResponse(res)
  },

  delete: async (id: string) => {
    const res = await apiCall(`/product-variants/${id}`, {
      method: "DELETE",
    })

    return handleResponse(res)
  },
}
