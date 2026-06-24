import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Image from "next/image"
import Link from "next/link"

export function MarketingProgram06Section() {
  const { marketingProgram06 } = useGetStoreFront()

  //
  if (!marketingProgram06?.campaigns || !marketingProgram06?.title) return null
  const { title, campaigns } = marketingProgram06

  return (
    <div className="space-y-2 rounded-4xl">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="grid grid-cols-4 gap-x-4">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.id}
            href={`/campaigns/${campaign.slug}`}
            className="block"
          >
            <div className="relative h-120 overflow-hidden rounded-2xl">
              <Image
                fill
                src={campaign.mainImage.url}
                alt={campaign.name}
                className="object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
