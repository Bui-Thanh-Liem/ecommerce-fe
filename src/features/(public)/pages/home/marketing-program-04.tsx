import { ProductItem } from "@/components/product-item"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useFindAllByCampaignProductVariants } from "@/hooks/apis/catalog/use-product-variant"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Image from "next/image"
import Link from "next/link"

export function MarketingProgram04Section() {
  //
  const { marketingProgram04 } = useGetStoreFront()
  const { data } = useFindAllByCampaignProductVariants(
    marketingProgram04?.campaign?.id || ""
  )

  //
  if (!marketingProgram04?.campaign || !marketingProgram04?.title) return null

  const { title, campaign } = marketingProgram04
  const productVariants = data?.metadata?.data || []

  return (
    <div className="space-y-4 rounded-4xl bg-white p-4 px-6 pb-6">
      <h2 className="text-xl font-bold text-sky-900">{title}</h2>
      <div className="grid grid-cols-3 gap-x-3">
        <div className="relative col-span-1 overflow-hidden rounded-lg py-0.5">
          <Link href={`/campaigns/${campaign?.slug}`}>
            <Image fill src={campaign?.mainImage?.url} alt={campaign?.name} />
          </Link>
        </div>

        <div className="col-span-2">
          <Carousel>
            <CarouselContent>
              {productVariants.map((variant) => (
                <CarouselItem key={variant.id} className="basis-1/3 py-0.5">
                  <ProductItem variant={variant} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}
