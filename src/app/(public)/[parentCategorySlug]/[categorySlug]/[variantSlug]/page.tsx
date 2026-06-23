import { ProductDetailPage } from "@/features/(public)/pages/product-detail/product-detail-page"
import { ISlugPageProps } from "@/shared/interfaces/common/category-slug-page-detail.interface"

export default async function Page({ params }: { params: ISlugPageProps }) {
  const { categorySlug, variantSlug, parentCategorySlug } = await params

  return (
    <ProductDetailPage
      categorySlug={categorySlug}
      parentCategorySlug={parentCategorySlug}
      variantSlug={variantSlug}
    />
  )
}
