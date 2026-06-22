import { ProductDetailPage } from "@/features/(public)/pages/product-detail/product-detail-page"

export default async function Page({
  params,
}: {
  params: {
    category: string
    subCategory: string
    product: string
    variant: string
  }
}) {
  const { category, product, variant, subCategory } = await params

  return (
    <ProductDetailPage
      categorySlug={category}
      subCategorySlug={subCategory}
      productSlug={product}
      variantSlug={variant}
    />
  )
}
