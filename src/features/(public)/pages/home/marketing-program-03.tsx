"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Image from "next/image"
import Link from "next/link"

export function MarketingProgram03Section() {
  const { marketingProgram03 } = useGetStoreFront()

  //
  if (!marketingProgram03?.mktPrograms || !marketingProgram03?.title)
    return null
  const { title, mktPrograms } = marketingProgram03

  //
  return (
    <div className="space-y-4 rounded-4xl bg-white p-4 px-6">
      <h2 className="text-xl font-bold text-sky-900">{title}</h2>
      <Carousel className="w-full py-2">
        <CarouselContent className="py-1">
          {mktPrograms.map((campaign, index) => (
            <CarouselItem key={index} className="basis-1/6">
              <Card className="relative">
                <CardContent className="flex items-center justify-center p-6">
                  <Link href={`/campaigns/${campaign.slug}`}>
                    <Image
                      fill
                      quality={100}
                      alt={campaign.name}
                      src={campaign.mainImage.url}
                      className="object-contain"
                    />
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  )
}
