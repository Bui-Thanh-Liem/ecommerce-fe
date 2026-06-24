import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { formatVND } from "@/utils/format-vnd.util"
import { useRedirectCategoryContext } from "@/context/redirect-category.context"
import { useRouter } from "next/navigation"
import { convertEnumToVN } from "@/utils/convert-enum-to-vn.util"
import { ProductVariantStatus } from "@/shared/enums/product-variant-status.enum"
import { cn } from "@/lib/utils"
import { randomColorByString } from "@/utils/random-color-by-string.util"

//
const formatSoldCount = (count: number) => {
  if (count >= 1000) {
    return `Đã bán ${(count / 1000).toFixed(1).replace(".", ",")}k`
  }
  return `Đã bán ${count}`
}

//
export function ProductItem({ variant }: { variant: IProductVariant }) {
  const product = variant.product || {}
  const specifications =
    product.specifications
      ?.flatMap((s) => s.items)
      ?.filter((att) => att.isHighlight) || []
  const category = product.category || {}
  const images = variant.productImages || []
  const salesAttributes = variant.salesAttributes || []
  const thumbnail = product.thumbnail || (images && images[0]?.image.url) || ""
  const attributeValues =
    salesAttributes.slice(0, 4).map((attr) => attr.desc) || []

  // Tính giá sau khi áp dụng giảm giá
  const discountPrice = variant.price * (1 - variant.discountPercent / 100)

  //
  const router = useRouter()
  const { setData } = useRedirectCategoryContext()

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

  const isNormalStatus = variant.status === ProductVariantStatus.NORMAL
  return (
    <Card
      className="min-h-120 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-sm transition-all duration-300 ease-out select-none hover:-translate-y-1 hover:shadow-xl"
      onClick={handleClick}
    >
      <CardContent className="relative flex h-full flex-col justify-between gap-2.5 p-3.5 font-sans text-sm">
        {/* 1. Top Badge: Trả góp cố định ở góc trên */}
        {!isNormalStatus && (
          <div
            className={cn(
              "absolute top-2.5 left-2.5 z-10 rounded px-2 py-0.5 text-[11px] font-medium",
              randomColorByString(variant.status)
            )}
          >
            {convertEnumToVN(variant.status)}
          </div>
        )}

        {/* 2. Khối Hình ảnh Sản phẩm */}
        <div
          className={cn(
            "relative flex h-36 w-full items-center justify-center",
            { "mt-6": !isNormalStatus }
          )}
        >
          <Image
            fill
            quality={100}
            src={thumbnail}
            alt={product.name}
            className="object-contain p-1 transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* 3. Nhãn độc quyền mua Online */}
        <div className="mt-1">
          <span className="rounded border border-[#ffeedd] bg-[#fff5f0] px-1.5 py-0.5 text-[11px] font-bold text-[#ff6600]">
            Online giá rẻ quá
          </span>
        </div>

        {/* 4. Tên sản phẩm */}
        <h2 className="line-clamp-2 min-h-10 text-[14px] leading-snug font-medium text-[#333] transition-colors hover:text-[#288ad6]">
          {product.name}
        </h2>

        {/* 5. Khối chứa Đặc tính sản phẩm & Tình trạng máy (Enum) */}
        <div className="flex flex-wrap gap-1">
          {/* Hiển thị tình trạng máy từ Enum (nếu có) */}
          {variant.conditions && (
            <span className="rounded bg-[#f1f1f1] px-2 py-0.5 text-[11px] font-medium text-[#555]">
              {convertEnumToVN(variant.conditions)}
            </span>
          )}
          {/* Tag mặc định cứng theo ảnh mẫu của bạn */}
          {attributeValues.length > 0 &&
            attributeValues.map((attr, idx) => (
              <span
                key={`${attr}-${idx}`}
                className="rounded bg-[#f1f1f1] px-2 py-0.5 text-[11px] text-[#555]"
              >
                {attr}
              </span>
            ))}
        </div>

        {/* 6. Khối Hiển thị Giá tiền */}
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

        {/* 7. Đặc điểm sản phẩm */}
        {specifications.length > 0 && (
          <div className="rounded-xl bg-gray-50 px-3 py-1.5">
            <ul className="list-inside list-disc space-y-1">
              {specifications.map((attr, idx) => (
                <li
                  key={`${attr}-${idx}`}
                  className="text-[10px] text-gray-700 marker:text-green-500"
                >
                  {attr.desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 8. Đánh giá sao & Số lượng đã bán */}
        <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#666]">
          <div className="flex items-center gap-0.5 font-bold text-[#fb1]">
            <span className="text-[14px] leading-none">★</span>
            <span className="font-normal text-[#333]">4.9</span>
          </div>
          <span className="mx-0.5 text-[10px] text-[#ccc]">•</span>
          <span className="text-[#666]">
            {formatSoldCount(variant.soldCount || 0)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
