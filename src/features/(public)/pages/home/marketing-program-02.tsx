"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay" // ← Thêm dòng này
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import Image from "next/image"
import Link from "next/link"

export function MarketingProgram02Section() {
  const { marketingProgram02 } = useGetStoreFront()

  if (!marketingProgram02?.campaigns.length) return null
  const { campaigns } = marketingProgram02

  return (
    <div className="mx-auto">
      <Carousel
        className="w-full"
        // Thêm plugins ở đây
        plugins={[
          Autoplay({
            delay: 3000, // Thời gian giữa các slide (ms) - bạn có thể chỉnh
            stopOnInteraction: true, // Dừng khi người dùng click/thao tác
            // stopOnMouseEnter: true, // Dừng khi hover (tùy chọn)
          }),
        ]}
        // Nên bật loop để chạy liên tục mượt mà
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {campaigns.map((campaign, index) => (
            <CarouselItem key={index} className="basis-1/2">
              <Card className="relative">
                <CardContent className="flex h-42 items-center justify-center p-6">
                  <Link href={`/campaigns/${campaign.slug}`}>
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
