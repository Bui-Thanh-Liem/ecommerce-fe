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
import { useRedirectCategoryContext } from "@/context/redirect-category.context"
import {
  useDeleteCustomerProduct,
  useFindOptionsCustomerProducts,
} from "@/hooks/apis/customer/use-customer-product"
import { CustomerProductType } from "@/shared/enums/customer-product-type.enum"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { formatVND } from "@/utils/format-vnd.util"
import { X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function CustomerHistorySection() {
  const { data } = useFindOptionsCustomerProducts(CustomerProductType.HISTORY)
  const { mutateAsync } = useDeleteCustomerProduct()
  const customerProducts = data?.metadata?.data || []

  //
  function handleRemoveClick(id: string) {
    mutateAsync(id)
  }

  //
  function handleRemoveAllClick() {
    const ids = customerProducts.map((cp) => cp.id)
    ids.forEach((id) => mutateAsync(id))
  }

  //
  if (customerProducts.length === 0) return null

  return (
    <div className="mx-auto space-y-3 overflow-hidden rounded-4xl border-2 border-sky-700 bg-white p-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <span className="text-2xl">🌞</span>
          <h2 className="text-xl font-bold text-sky-500">Sản phẩm đã xem</h2>
        </div>
        <p
          className="cursor-pointer text-gray-400 hover:underline"
          onClick={handleRemoveAllClick}
        >
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
              <CarouselItem key={cp.id} className="basis-1/2 lg:basis-1/3">
                <ProductCard
                  variant={cp.productVariant}
                  onRemoveClick={() => handleRemoveClick(cp.id)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

function ProductCard({
  variant,
  onRemoveClick,
}: {
  variant: IProductVariant
  onRemoveClick?: () => void
}) {
  //
  const router = useRouter()
  const { setData } = useRedirectCategoryContext()

  //
  const product = variant.product
  const category = product.category || {}
  const discountPrice = variant.price * (1 - variant.discountPercent / 100)
  const attributeValues =
    variant.salesAttributes?.filter((att) => att.isSKU) || []
  const attrName = attributeValues.map((att) => att.desc).join(", ")

  //
  function handleClick() {
    const productSlug = product.slug || ""
    const variantSlug = variant.slug || ""
    const categorySlug = category.slug || ""
    const parentCategorySlug = category.parent?.slug || ""

    router.push(
      !parentCategorySlug
        ? `/${categorySlug}/${variantSlug}`
        : `/${parentCategorySlug}/${categorySlug}/${variantSlug}`
    )

    setData({
      productSlug: productSlug,
      categoryName: category.name || "",
      parentCategoryName: category.parent?.name || "",
    })
  }

  //
  function handleRemoveClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation()
    if (onRemoveClick) onRemoveClick()
  }

  return (
    <Card className="m-1 p-3" onClick={handleClick}>
      <CardHeader className="px-0">
        <CardAction onClick={handleRemoveClick}>
          <X size={20} className="cursor-pointer text-gray-500" />
        </CardAction>
        <div className="flex items-center gap-x-3">
          {product.thumbnail && (
            <Image
              width={100}
              height={60}
              alt={product.name}
              src={product.thumbnail}
              className="object-contain"
            />
          )}
          <div>
            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
            {attrName && (
              <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
                {attrName}
              </CardDescription>
            )}
            <CardDescription className="text mt-2 text-red-500">
              <div className="mt-0.5 flex flex-col gap-1">
                {/* Giá hiện tại / Giá giảm */}
                <span className="text-[17px] leading-none font-bold text-[#d0021c]">
                  {formatVND(discountPrice)}
                </span>

                {/* Giá gốc cũ & % Giảm */}
                {variant.discountPercent > 0 && (
                  <div className="flex items-center gap-1.5 text-[12px]">
                    <span className="text-[#999] line-through">
                      {formatVND(variant.price)}
                    </span>
                    <span className="font-semibold text-[#d0021c]">
                      -{variant.discountPercent}%
                    </span>
                  </div>
                )}
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
