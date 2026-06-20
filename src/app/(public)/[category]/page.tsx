export default async function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  const { category } = await params

  return <div>Danh mục: {category}</div>
}
