"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFindProductBySlug } from "@/hooks/apis/catalog/use-product"
import { useFindProductVariantBySlug as find } from "@/hooks/apis/catalog/use-product-variant"
import { cn } from "@/lib/utils"
import { IProductImage } from "@/shared/interfaces/models/catalog/product-image.interface"
import { IVariantAttribute } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { ISpecification } from "@/shared/interfaces/models/catalog/product.interface"
import { Home } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export function ProductDetailPage({
  categorySlug,
  productSlug,
  variantSlug,
}: {
  categorySlug: string
  productSlug: string
  variantSlug: string
}) {
  //
  const { data: productRes, isLoading } = useFindProductBySlug(productSlug)
  const { data: variantRes, isLoading: isVariantLoading } = find(variantSlug)

  //
  const product = productRes?.metadata
  const variant = variantRes?.metadata

  //
  const saleAttribute = variant?.salesAttributes
    ?.filter((attr) => attr.isSKU)
    ?.map((attr) => attr.value)
    .join(", ")

  const images = variant?.productImages || []
  const specifications = product?.specifications || []
  const salesAttributes = variant?.salesAttributes || []

  console.log("product detail", product)
  console.log("product variant", variant)

  return (
    <div className="grid grid-cols-12 bg-gray-50">
      <div className="col-span-2"></div>
      <div className="col-span-8 py-8">
        <div className="space-y-4 pb-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home size={18} />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${categorySlug}`}>
                  {categorySlug}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${categorySlug}/${productSlug}`}>
                  {productSlug}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Product Info */}
          <div className="flex items-center gap-x-3">
            <h2 className="font-bold">
              {product?.name} {saleAttribute}
            </h2>
            <div className="flex items-center gap-0.5 font-bold text-[#fb1]">
              <span className="text-[14px] leading-none">★</span>
              <span className="text-sm font-normal text-[#333]">4.9</span>
            </div>
            <p className="text-sm text-gray-500">
              Đã bán: {variant?.soldCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-8">
          {/* Product Images */}
          <div className="col-span-2 space-y-6">
            <ImageCarousel images={images} />
            <InfoDetail
              desc={product?.desc || ""}
              specifications={specifications}
              salesAttributes={salesAttributes}
            />
          </div>

          {/*  */}
          <div className="col-span-1 rounded-2xl bg-white p-4">d</div>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}

function ImageCarousel({ images }: { images: IProductImage[] }) {
  // 1. Tạo state để lưu trữ instance của Carousel API
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  // 2. Lắng nghe sự kiện chuyển ảnh của Carousel để cập nhật thumbnail hoạt động
  useEffect(() => {
    if (!api) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // 3. Hàm xử lý khi click vào thumbnail
  const handleThumbnailClick = (index: number) => {
    if (!api) return
    api.scrollTo(index)
  }

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-4xl bg-white">
      {/* Main Carousel */}
      <div>
        {/* Truyền setApi vào đây */}
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Card className="relative border-none bg-transparent shadow-none">
                  <CardContent className="flex h-80 items-center justify-center p-0">
                    <Image
                      fill
                      alt={`Product image ${index + 1}`}
                      quality={100}
                      src={image.image.url}
                      className="rounded-4xl object-contain"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* 4. Vùng hiển thị Thumbnails phía dưới */}
      <div className="flex justify-center gap-2 overflow-x-auto py-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              "relative h-10 w-10 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-gray-100 transition-all",
              current === index
                ? "border-primary ring-primary/20 scale-105 ring-2"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <Image
              fill
              src={image.image.url}
              className="object-cover"
              alt={`Thumbnail ${index + 1}`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function InfoDetail({
  desc,
  specifications,
  salesAttributes,
}: {
  desc: string
  specifications: ISpecification[]
  salesAttributes: IVariantAttribute[]
}) {
  const specificationData = specifications.map((spec) => ({
    value: spec.title,
    trigger: spec.title,
    content: (
      <div className="space-y-4">
        {spec.items
          ?.sort((a, b) => a.order - b.order)
          .map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span className="min-w-52">{item.key}</span>
              <span
                className={cn(
                  "flex-1 text-gray-500",
                  item.isHighlight && "text-sky-400"
                )}
              >
                {item.value}
              </span>
            </div>
          ))}
      </div>
    ),
  }))

  const saleAttributeData = {
    value: "Thông số cụ thể của sản phẩm",
    trigger: "Thông số cụ thể của sản phẩm",
    content: (
      <div className="space-y-4">
        {salesAttributes?.map((item, index) => (
          <div key={index} className="flex justify-between border-b pb-2">
            <span className="min-w-52">{item.label}</span>
            <span className={cn("flex-1 text-gray-500")}>{item.value}</span>
          </div>
        ))}
      </div>
    ),
  }

  return (
    <div className="overflow-hidden rounded-4xl bg-white p-4">
      <Tabs
        className="flex flex-col items-center"
        defaultValue="specifications"
      >
        <TabsList>
          <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
          <TabsTrigger value="information">Thông tin sản phẩm</TabsTrigger>
        </TabsList>
        <TabsContent value="specifications" className="w-full space-y-3 pt-8">
          <Accordion type="multiple" defaultValue={[saleAttributeData.value]}>
            <AccordionItem
              key={saleAttributeData.value}
              value={saleAttributeData.value}
            >
              <AccordionTrigger className="bg-gray-100 font-medium">
                {saleAttributeData.trigger}
              </AccordionTrigger>
              {/* Đã xóa mt-2 và bg-gray-50 ở đây để không lỗi animation */}
              <AccordionContent>
                {/* Đưa style nền và khoảng cách vào div bọc ruột bên trong */}
                <div className="mt-2 rounded-b-md bg-gray-50 p-4">
                  {saleAttributeData.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="multiple">
            {specificationData?.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="bg-gray-100 font-medium">
                  {item.trigger}
                </AccordionTrigger>
                {/* Đã xóa mt-2 và bg-gray-50 ở đây để không lỗi animation */}
                <AccordionContent>
                  {/* Đưa style nền và khoảng cách vào div bọc ruột bên trong */}
                  <div className="mt-2 rounded-b-md bg-gray-50 p-4">
                    {item.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        <TabsContent value="information" className="p-0 pt-8">
          <div
            className="prose max-w-full!"
            dangerouslySetInnerHTML={{
              __html:
                desc || '<p class="flex items-center justify-center">Empty</p>',
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
