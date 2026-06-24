import { useGetStoreFront } from "@/hooks/use-get-store-front"

export function SuggestForYouSection() {
  const { suggestForYou } = useGetStoreFront()

  //
  if (!suggestForYou?.length) return null

  return (
    <div className="space-y-4 rounded-4xl bg-white p-4 px-6">
      <h2 className="text-xl font-bold text-sky-900">Gợi ý cho bạn</h2>
      <div className="flex flex-wrap items-center gap-3"></div>
    </div>
  )
}
