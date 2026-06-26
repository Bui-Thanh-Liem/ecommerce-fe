"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import Link from "next/link"

export function MainBannerSection() {
  const { mainBanner, isLoading } = useGetStoreFront()

  if (isLoading) {
    return (
      <div className="mx-auto">
        <Skeleton className="h-50 w-full" />
      </div>
    )
  }

  //
  if (mainBanner.length === 0) return null

  //
  if (mainBanner.length === 1) {
    return (
      <div className="mx-auto">
        <Card className="relative">
          <CardContent className="flex h-50 items-center justify-center p-6">
            <Link href={`/campaigns/${mainBanner[0].campaignSlug}`}>
              <Image
                fill
                quality={100}
                className="object-cover"
                src={mainBanner[0].image.url}
                alt={mainBanner[0].campaignSlug}
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
      <Carousel
        className="w-full"
        // Thêm plugins ở đây
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        // Nên bật loop để chạy liên tục mượt mà
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {mainBanner.map((banner, index) => (
            <CarouselItem key={index}>
              <Card className="relative">
                <CardContent className="flex h-50 items-center justify-center p-6">
                  <Link href={`/campaign/${banner.campaignSlug}`}>
                    <Image
                      fill
                      quality={100}
                      src={banner.image.url}
                      alt={banner.campaignSlug}
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
