import { useGetStoreFront } from "@/hooks/use-get-store-front"

export function MarketingProgram04Section() {
  const { marketingProgram04 } = useGetStoreFront()

  //
  if (!marketingProgram04) return null
  const { title } = marketingProgram04

  return (
    <div className="space-y-4 rounded-4xl bg-white p-4 px-6">
      <h2 className="text-xl font-bold text-sky-900">{title}</h2>
      <div className="flex flex-wrap items-center gap-3"></div>
    </div>
  )
}
