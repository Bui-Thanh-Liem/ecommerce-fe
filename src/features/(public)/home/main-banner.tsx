"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useFindOptionsMainBanners } from "@/hooks/apis/use-main-banner"
import Image from "next/image"
import Link from "next/link"

export function MainBanner() {
  const { data } = useFindOptionsMainBanners()
  const mainBanners = data?.metadata?.data || []

  //
  if (mainBanners.length === 0) return null

  //
  if (mainBanners.length === 1) {
    return (
      <div className="mx-auto">
        <Card className="relative">
          <CardContent className="flex h-50 items-center justify-center p-6">
            <Link href={mainBanners[0].slug}>
              <Image
                fill
                quality={100}
                className="object-cover"
                alt={mainBanners[0].title}
                src={mainBanners[0].image.url}
              />
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  //
  return (
    <div className="mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {mainBanners.map((banner, index) => (
            <CarouselItem key={index}>
              <Card className="relative">
                <CardContent className="flex h-50 items-center justify-center p-6">
                  <Link href={banner.slug}>
                    <Image
                      fill
                      quality={100}
                      alt={banner.title}
                      src={banner.image.url}
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
