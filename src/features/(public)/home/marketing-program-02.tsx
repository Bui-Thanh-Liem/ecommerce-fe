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

export function MarketingProgram02Section() {
  const { marketingProgram02 } = useGetStoreFront()

  //
  if (!marketingProgram02?.campaigns) return null
  const { campaigns } = marketingProgram02

  //
  return (
    <div className="mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {campaigns.map((campaign, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <Card className="relative">
                <CardContent className="flex h-42 items-center justify-center p-6">
                  <Link href={campaign.slug}>
                    <Image
                      fill
                      quality={100}
                      alt={campaign.name}
                      src={campaign.mainImage.url}
                      className="object-cover"
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
