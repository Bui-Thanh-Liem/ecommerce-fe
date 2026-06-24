import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Image from "next/image"
import Link from "next/link"

export function MarketingProgram05Section() {
  const { marketingProgram05 } = useGetStoreFront()

  //
  if (!marketingProgram05?.campaign || !marketingProgram05?.title) return null
  const { title, campaign } = marketingProgram05

  return (
    <div className="space-y-2 rounded-4xl">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <Link href={`/campaigns/${campaign?.slug}`} className="block">
        <div className="relative h-96 overflow-hidden rounded-2xl">
          <Image fill src={campaign?.mainImage?.url} alt={campaign?.name} />
        </div>
      </Link>
    </div>
  )
}
