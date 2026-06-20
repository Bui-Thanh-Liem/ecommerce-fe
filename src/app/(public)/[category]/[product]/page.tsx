export default async function ProductPage({
  params,
}: {
  params: { category: string; product: string }
}) {
  const { category, product } = await params

  return (
    <div>
      Sản phẩm: {product} trong danh mục {category}
    </div>
  )
}
