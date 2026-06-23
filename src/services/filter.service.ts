import { QueryDto } from "@/shared/dtos/common/query.dto"
import { ResMetadataDto } from "@/shared/dtos/res/metadata.dto"
import { IBrand } from "@/shared/interfaces/models/catalog/brand.interface"
import { ICategory } from "@/shared/interfaces/models/catalog/category.interface"
import { apiCall } from "@/utils/call-api.util"
import { generateQueryParams } from "@/utils/generate-query-params.util"
import { handleResponse } from "@/utils/handle-response.util"

export const filterServices = {
  findBrandsByCategorySlug: async (categorySlug?: string, query?: QueryDto) => {
    const queryParams = generateQueryParams({ params: query })

    const res = await apiCall<ResMetadataDto<IBrand>>(
      `/filters/category/${categorySlug}?${queryParams}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<IBrand>>(res)
  },

  findChildrenCategoryBySlug: async (slug: string) => {
    const res = await apiCall<ResMetadataDto<ICategory>>(
      `/filters/category/children/${slug}`,
      {
        method: "GET",
      }
    )

    return handleResponse<ResMetadataDto<ICategory>>(res)
  },
}
