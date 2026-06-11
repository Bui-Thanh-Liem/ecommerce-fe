"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardAction,
  CardDescription,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { useFindOptionsCustomerProducts } from "@/hooks/apis/use-customer-product"
import { X } from "lucide-react"
import Image from "next/image"

export function CustomerHistory() {
  const { data } = useFindOptionsCustomerProducts()
  const customerProducts = data?.metadata?.data || []

  //
  if (customerProducts.length === 0) return null

  return (
    <div className="mx-auto space-y-3 overflow-hidden rounded-4xl border-2 border-sky-700 bg-white p-4 px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <span className="text-2xl">🌞</span>
          <h2 className="text-xl font-bold text-sky-500">Sản phẩm đã xem</h2>
        </div>
        <p className="cursor-pointer text-gray-400 hover:underline">
          xóa tất cả
        </p>
      </div>
      <div>
        <Carousel
          className="w-full"
          opts={{
            align: "start",
          }}
        >
          <CarouselContent>
            {customerProducts.map((cp) => (
              <CarouselItem key={cp.id} className="basis-1/2 lg:basis-1/4">
                <Card className="m-1 p-3">
                  <CardHeader className="px-0">
                    <CardAction>
                      <X size={20} className="cursor-pointer text-gray-500" />
                    </CardAction>
                    <div className="flex items-center gap-x-3">
                      <Image
                        alt="d"
                        width={44}
                        height={44}
                        src="/images/bottom-left.png"
                      />
                      <div>
                        <CardTitle className="line-clamp-1">
                          Product Name Product Name Product Name
                        </CardTitle>
                        <CardDescription className="text text-red-500">
                          $45.00
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
