import { Badge } from "@/components/ui/badge"
import { useGetStoreFront } from "@/hooks/use-get-store-front"

export function PopularSearchSection() {
  const { popularSearch } = useGetStoreFront()

  //
  if (!popularSearch) return null
  const { title, searches } = popularSearch

  return (
    <div className="space-y-4 rounded-4xl bg-white p-4 px-6">
      <h2 className="text-xl font-bold text-sky-900">{title}</h2>
      <div className="flex flex-wrap items-center gap-3">
        {searches.map((search) => (
          <Badge variant="secondary" key={search.id}>
            {search.text}
          </Badge>
        ))}
      </div>
    </div>
  )
}
