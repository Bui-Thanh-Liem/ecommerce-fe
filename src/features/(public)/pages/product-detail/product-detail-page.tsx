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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRedirectCategoryContext } from "@/context/redirect-category.context"
import { useRLCustomerContext } from "@/context/region-location-customer.context"
import { useFindProductBySlug } from "@/hooks/apis/catalog/use-product"
import { useFindProductVariantBySlug as find } from "@/hooks/apis/catalog/use-product-variant"
import { cn } from "@/lib/utils"
import { ISlugPageProps } from "@/shared/interfaces/common/category-slug-page-detail.interface"
import { IProductImage } from "@/shared/interfaces/models/catalog/product-image.interface"
import { IVariantAttribute } from "@/shared/interfaces/models/catalog/product-variant.interface"
import {
  IProduct,
  ISpecification,
} from "@/shared/interfaces/models/catalog/product.interface"
import { formatVND } from "@/utils/format-vnd.util"
import {
  Home,
  Star,
  Info,
  ChevronUp,
  ChevronDown,
  CircleCheckBig,
  ChessQueen,
  ShoppingCart,
  Truck,
  MapPinned,
  Store,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

type GroupedSalesAttributes = Record<
  string,
  {
    value: string
    label: string
    skuSlug: string
    desc?: string
  }[]
>

export function ProductDetailPage({
  variantSlug,
  categorySlug,
  parentCategorySlug,
}: ISlugPageProps) {
  const { location } = useRLCustomerContext()
  const { data } = useRedirectCategoryContext()
  const productSlug = data?.productSlug || ""

  //
  const { data: productRes, isLoading } = useFindProductBySlug(productSlug)
  const { data: variantRes, isLoading: isVariantLoading } = find(variantSlug)

  //
  const product = productRes?.metadata
  const variant = variantRes?.metadata

  //
  const salesAttributesWithoutSKU = variant?.salesAttributes || []
  const saleAttribute = salesAttributesWithoutSKU
    ?.filter((attr) => attr.isSKU)
    ?.map((attr) => attr.value)
    .join(", ")

  //
  const salesAttributes =
    product?.productVariants
      ?.map((variant) =>
        variant.salesAttributes.map((attr) => ({
          ...attr,
          skuSlug: variant.slug,
        }))
      )
      .flat() || []

  //
  const images = variant?.productImages || []
  const specifications = product?.specifications || []

  if (isLoading || isVariantLoading || !product || !variant) {
    return <ProductDetailSkeleton />
  }

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
                <BreadcrumbLink href={`/${parentCategorySlug}`}>
                  {data?.parentCategoryName}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${parentCategorySlug}/${categorySlug}`}>
                  {data?.categoryName}
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
          <div className="col-span-2 space-y-6">
            <ImageCarousel images={images} />
            <InfoDetail
              desc={product?.desc || ""}
              specifications={specifications}
              salesAttributes={salesAttributesWithoutSKU}
            />

            <Rating product={product} />
          </div>

          {/*  */}
          <div className="col-span-1">
            <div className="space-y-6 rounded-4xl bg-white p-4">
              <SalesAttributes
                variantSlug=""
                categorySlug={categorySlug}
                salesAttributes={salesAttributes}
                parentCategorySlug={parentCategorySlug}
                salesAttributesWithoutSKU={salesAttributesWithoutSKU}
              />
              <ServicePackage
                price={variant?.price}
                discountPercent={variant?.discountPercent}
              />

              <div className="space-y-2">
                <p className="font-bold">Thông tin vận chuyển</p>
                <p className="text-sm text-gray-600">
                  <strong className="flex items-center gap-x-1">
                    <span>
                      <MapPinned size={18} className="text-red-400" />
                    </span>
                    Giao đến:
                  </strong>
                  {location || "Vui lòng chọn địa chỉ giao hàng"}
                </p>
                <p className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
                  <strong className="flex items-center gap-x-1">
                    <span className="animate-truck alignment-baseline inline-block">
                      <Truck size={18} className="text-blue-600" />
                    </span>
                    Giao tiết kiệm:
                  </strong>
                  Giao từ 12h - 14h, ngày làm việc trong tuần:{" "}
                  <span className="font-medium text-green-600">Miễn phí</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-100 bg-amber-50 text-amber-600 hover:border-amber-200 hover:bg-amber-100 hover:text-amber-700"
                >
                  <ShoppingCart /> Thêm vào giỏ hàng
                </Button>
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                  Mua ngay
                </Button>
              </div>

              <Button
                variant="ghost"
                className="w-full text-blue-500 hover:bg-transparent hover:text-blue-600"
              >
                <Store /> Xem cửa hàng gần nhất có hàng
              </Button>
            </div>
          </div>
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
              <span className="min-w-52">{item.label}</span>
              <span
                className={cn(
                  "flex-1 text-gray-500",
                  item.isHighlight && "text-sky-400"
                )}
              >
                {item.desc}
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
            <span className={cn("flex-1 text-gray-500")}>{item.desc}</span>
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
          <Accordion
            type="multiple"
            className="rounded-4xl"
            defaultValue={[saleAttributeData.value]}
          >
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

          {specificationData.length > 0 &&
            specificationData.map((item, index) => (
              <Accordion
                type="multiple"
                className="rounded-4xl"
                key={item.trigger}
                defaultValue={index <= 1 ? [item.trigger] : []}
              >
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
              </Accordion>
            ))}
        </TabsContent>
        <TabsContent value="information" className="p-0 pt-8">
          <ProductDescription desc={desc} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductDescription({ desc }: { desc: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="relative">
      <div
        className={cn(
          "prose max-w-full overflow-hidden transition-all duration-300",
          expanded ? "max-h-none" : "max-h-125"
        )}
        dangerouslySetInnerHTML={{
          __html:
            desc || '<p class="flex items-center justify-center">Empty</p>',
        }}
      />

      {!expanded && (
        <div className="pointer-events-none absolute right-0 -bottom-16 left-0 h-32 bg-linear-to-t from-white to-transparent" />
      )}

      <div className="mt-6 flex justify-center">
        <Button variant="ghost" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? (
            <>
              Thu gọn
              <ChevronUp className="ml-2 size-4" />
            </>
          ) : (
            <>
              Xem thêm
              <ChevronDown className="ml-2 size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function Rating({ product }: { product: IProduct }) {
  const average = 5
  const total = 2600

  const ratings: {
    star: number
    percent: number
  }[] = [
    { star: 5, percent: 100 },
    { star: 4, percent: 0 },
    { star: 3, percent: 0 },
    { star: 2, percent: 0 },
    { star: 1, percent: 0 },
  ]

  return (
    <div className="rounded-4xl bg-white p-6">
      <h2 className="mb-8 text-center font-semibold">
        Đánh giá {product.name}
      </h2>

      <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center">
        {/* Điểm trung bình */}
        <div className="flex min-w-52 flex-col items-center justify-center">
          <div className="flex items-end gap-1">
            <Star className="size-6 fill-amber-400 text-amber-400" />

            <span className="text-6xl leading-none font-bold">{average}</span>

            <span className="text-muted-foreground pb-1 text-xl">/5</span>
          </div>

          <div className="text-muted-foreground mt-3 flex items-center gap-1 text-sm">
            <span>
              {(total / 1000).toFixed(1).replace(".", ",")}k khách hài lòng
            </span>
            <Info className="size-4" />
          </div>
        </div>

        {/* Thống kê */}
        <div className="flex-1 space-y-3">
          {ratings.map((item) => (
            <div key={item.star} className="flex items-center gap-3">
              <div className="flex w-8 items-center justify-end gap-1 text-sm">
                <span>{item.star}</span>
                <Star className="size-3 fill-amber-400 text-amber-400" />
              </div>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${item.percent}%`,
                  }}
                />
              </div>

              <span className="w-12 text-right text-sm font-medium">
                {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button size="lg" className="min-w-80">
          Viết đánh giá
        </Button>
      </div>
    </div>
  )
}

function SalesAttributes({
  categorySlug,
  salesAttributes,
  parentCategorySlug,
  salesAttributesWithoutSKU,
}: {
  salesAttributesWithoutSKU: IVariantAttribute[]
  salesAttributes: (IVariantAttribute & { skuSlug: string })[]
} & ISlugPageProps) {
  const router = useRouter()

  // Gom nhóm theo key
  const groupedSalesAttributes = useMemo(() => {
    return salesAttributes.reduce<GroupedSalesAttributes>((acc, attr) => {
      if (!acc[attr.key]) {
        acc[attr.key] = []
      }

      if (!acc[attr.key].some((item) => item.value === attr.value)) {
        acc[attr.key].push({
          value: attr.value,
          label: attr.label,
          desc: attr.desc,
          skuSlug: attr.skuSlug,
        })
      }

      return acc
    }, {})
  }, [salesAttributes])

  // Variant đang được chọn
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(() => {
    return salesAttributesWithoutSKU.reduce<Record<string, string>>(
      (acc, attr) => {
        acc[attr.key] = attr.value
        return acc
      },
      {}
    )
  })

  //
  const handleSelect = (key: string, value: string) => {
    // 1. Tạo ra trạng thái lựa chọn MỚI NHẤT sau khi user click
    const nextAttributes = {
      ...selectedAttributes,
      [key]: value,
    }

    // 2. Cập nhật state UI công khai
    setSelectedAttributes(nextAttributes)

    // 3. THUẬT TOÁN TÌM SKU SLUG CHÍNH XÁC:
    // Tìm trong mảng salesAttributes gốc xem có skuSlug nào chứa đầy đủ các cặp key-value đang chọn hay không.

    // Đầu tiên gom nhóm các attr theo skuSlug để biết skuSlug đó gồm những thuộc tính nào
    const slugMap: Record<string, Record<string, string>> = {}

    salesAttributes.forEach((attr) => {
      if (!slugMap[attr.skuSlug]) slugMap[attr.skuSlug] = {}
      slugMap[attr.skuSlug][attr.key] = attr.value
    })

    // Tìm slug khớp 100% với nextAttributes
    const matchedSlug = Object.keys(slugMap).find((slug) => {
      const attrOfSlug = slugMap[slug]
      // Kiểm tra tất cả các key trong nextAttributes có trùng với thuộc tính của slug này không
      return Object.keys(nextAttributes).every(
        (k) => attrOfSlug[k] === nextAttributes[k]
      )
    })

    if (matchedSlug) {
      router.push(`/${parentCategorySlug}/${categorySlug}/${matchedSlug}`)
    } else {
      toast.info(
        "Sản phẩm đã hết hàng hoặc không tồn tại với lựa chọn của bạn."
      )
    }
  }

  //
  const renderColor = (key: string, value: string) => {
    if (key.toLowerCase() === "color") {
      return (
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: value }}
        />
      )
    }
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedSalesAttributes).map(([key, values]) => (
        <div key={key}>
          <div className="flex flex-wrap gap-2">
            {values.map((item) => {
              const isSelected = selectedAttributes[key] === item.value

              return (
                <Button
                  size="sm"
                  key={item.value}
                  variant="outline"
                  className={cn({
                    "border-sky-100 bg-sky-50 text-sky-500 hover:bg-sky-50 hover:text-sky-400":
                      isSelected,
                  })}
                  onClick={() => handleSelect(key, item.value)}
                >
                  {item.desc}
                  {renderColor(key, item.value)}
                </Button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function ServicePackage({
  price,
  discountPercent,
}: {
  price: number
  discountPercent: number
}) {
  const discountedPrice = price * (1 - discountPercent / 100)

  const priceElement = (
    <div className="space-x-2">
      <span className="text-sm text-gray-400 line-through">
        {formatVND(price)}
      </span>
      <span className="text-lg font-bold text-red-500">
        {formatVND(discountedPrice)}
      </span>
    </div>
  )

  const packages = [
    {
      id: "plus",
      title: priceElement,
      description: "Bảo hành theo nhà sản xuất",
      icon: <CircleCheckBig size={14} color="green" className="font-bold" />,
    },
    {
      id: "pro",
      title: (
        <div className="flex gap-x-2">
          {priceElement}
          <span className="text-sm text-orange-400"> +{formatVND(500000)}</span>
        </div>
      ),
      description: (
        <span className="block space-y-2">
          <span className="flex gap-x-2">
            <ChessQueen size={20} color="orange" /> BH 1 đổi 1 bởi ĐMX trong 12
            tháng cho sản phẩm từ 30-40 triệu
          </span>
          <span className="flex gap-x-2">
            <ChessQueen size={20} color="orange" /> BHMR 1 năm bởi ĐMX cho sản
            phẩm từ 30-40 triệu
          </span>
          <span className="flex gap-x-2">
            <ChessQueen size={20} color="orange" /> BHRV 6 tháng ĐMX cho sản
            phẩm từ 30-40 triệu
          </span>
        </span>
      ),
    },
  ]

  function handleSelectPackage(value: string) {
    console.log(
      "Selected package:",
      packages.find((pkg) => pkg.id === value)
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Gói dịch vụ</h3>
      <RadioGroup
        defaultValue="plus"
        className="max-w-sm"
        onValueChange={handleSelectPackage}
      >
        {packages.map((pkg) => (
          <FieldLabel htmlFor={`${pkg.id}-plan`} key={pkg.id}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{pkg.title}</FieldTitle>
                <FieldDescription className="flex items-center gap-x-2">
                  {pkg.icon}
                  {pkg.description}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value={pkg.id} id={`${pkg.id}-plan`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </div>
  )
}

// Thêm component Skeleton này vào file của bạn (ở trên hoặc dưới cùng đều được)
function ProductDetailSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-12 bg-gray-50">
      <div className="col-span-2"></div>
      <div className="col-span-8 space-y-6 py-8">
        {/* Breadcrumb & Title Skeleton */}
        <div className="space-y-4 pb-6">
          <div className="h-4 w-1/3 rounded-md bg-gray-200" />
          <div className="flex items-center gap-x-3">
            <div className="h-7 w-1/2 rounded-md bg-gray-200" />
            <div className="h-5 w-12 rounded-md bg-gray-200" />
            <div className="h-5 w-20 rounded-md bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-8">
          {/* Left Column (Carousel & Tabs) */}
          <div className="col-span-2 space-y-6">
            {/* Image Carousel Box */}
            <div className="flex flex-col gap-4 overflow-hidden rounded-4xl bg-white p-4">
              <div className="h-80 w-full rounded-4xl bg-gray-200" />
              <div className="flex justify-center gap-2 py-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 shrink-0 rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>

            {/* InfoDetail Tabs Box */}
            <div className="space-y-4 overflow-hidden rounded-4xl bg-white p-6">
              <div className="flex justify-center gap-4 border-b pb-2">
                <div className="h-8 w-32 rounded-md bg-gray-200" />
                <div className="h-8 w-32 rounded-md bg-gray-200" />
              </div>
              <div className="space-y-3 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 w-full rounded-xl bg-gray-100" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Options) */}
          <div className="col-span-1">
            <div className="space-y-6 rounded-4xl bg-white p-6">
              {/* Sales Attributes */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-16 rounded-md bg-gray-200" />
                  ))}
                </div>
              </div>

              {/* Service Package */}
              <div className="space-y-3">
                <div className="h-5 w-24 rounded-md bg-gray-200" />
                <div className="h-16 w-full rounded-xl bg-gray-100" />
                <div className="h-24 w-full rounded-xl bg-gray-100" />
              </div>

              {/* Shipping info */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-1/2 rounded-md bg-gray-200" />
                <div className="h-4 w-3/4 rounded-md bg-gray-200" />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <div className="h-11 w-1/2 rounded-xl bg-gray-200" />
                <div className="h-11 w-1/2 rounded-xl bg-gray-200" />
              </div>
              <div className="h-10 w-full rounded-xl bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
