import { ProductVariantListPage } from "@/features/(public)/pages/product-variant-list.tsx/product-variant-list-page"

export default async function ProductPage({
  params,
}: {
  params: { category: string; product: string }
}) {
  const { category, product } = await params

  return (
    <ProductVariantListPage productSlug={product} categorySlug={category} />
  )
}
