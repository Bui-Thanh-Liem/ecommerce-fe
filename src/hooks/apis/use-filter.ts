import { filterServices } from "@/services/filter.service"
import { useQuery } from "@tanstack/react-query"

export const useFindBrandsByCategorySlug = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["brands-by-category", categorySlug],
    queryFn: () => filterServices.findBrandsByCategorySlug(categorySlug),
    enabled: !!categorySlug,
  })
}

export const useFindChildrenCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["categories-children", slug],
    queryFn: () => filterServices.findChildrenCategoryBySlug(slug),
    enabled: !!slug,
  })
}
