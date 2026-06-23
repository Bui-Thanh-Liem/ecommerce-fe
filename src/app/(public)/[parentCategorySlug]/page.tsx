import { ProductListPage } from "@/features/(public)/pages/product-list.tsx/product-list-page"
import { ISlugPageProps } from "@/shared/interfaces/common/category-slug-page-detail.interface"

export default async function Page({ params }: { params: ISlugPageProps }) {
  const { parentCategorySlug } = await params

  return <ProductListPage parentCategorySlug={parentCategorySlug} />
}
