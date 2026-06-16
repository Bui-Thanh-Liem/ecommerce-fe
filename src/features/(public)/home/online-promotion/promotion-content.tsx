"use client"

import { useMemo } from "react"
import { IPromotion } from "@/shared/interfaces/models/mkt-program/promotion.interface"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { useFindOptionsProductPromotions } from "@/hooks/apis/mkt-program/use-product-promotion"
import { PromotionApplyType } from "@/shared/enums/promotion-apply-type.enum"
import Image from "next/image"
import { useFindVariantByPromotion } from "@/hooks/apis/mkt-program/use-category-promotion"

export function PromotionContent({ promotion }: { promotion: IPromotion }) {
  const {
    name,
    image,
    applyType,
    id: promotionId,
    discountPercentage,
  } = promotion

  // ==========================================
  // 1. FETCH DATA THEO ĐIỀU KIỆN (CONDITIONAL FETCHING)
  // ==========================================

  // TRƯỜNG HỢP A: Nếu là KM theo sản phẩm cụ thể -> Fetch bảng trung gian ProductPromotions
  const isProductApply = applyType === PromotionApplyType.PRODUCT
  const { data: productPromoRes, isLoading: loadingProdPromo } =
    useFindOptionsProductPromotions({
      filters: { promotion: promotionId },
    })
  const productPromotions = useMemo(
    () => productPromoRes?.metadata?.data || [],
    [productPromoRes]
  )

  // TRƯỜNG HỢP B: Nếu là KM theo danh mục -> Bước 1: Fetch danh mục được gán KM
  const isCategoryApply = applyType === PromotionApplyType.CATEGORY
  const { data: categoryPromoRes, isLoading: loadingCatePromo } =
    useFindVariantByPromotion({
      filters: { promotion: promotionId },
    })
  const categoryPromotions = useMemo(
    () => categoryPromoRes?.metadata?.data || [],
    [categoryPromoRes]
  )

  // ==========================================
  // 2. CHUẨN HÓA VÀ HỢP NHẤT DỮ LIỆU (USEMEMO)
  // ==========================================
  const displayProducts = useMemo(() => {
    const productMap = new Map<
      string,
      {
        variant: IProductVariant
        displayPrice: number
        tag?: string
      }
    >()

    // Hướng xử lý 1: Nếu apply theo PRODUCT
    if (isProductApply && productPromotions.length > 0) {
      productPromotions.forEach((pp) => {
        if (!pp.productVariant) return

        const promoPrice =
          pp.customDiscount > 0
            ? pp.customDiscount
            : pp.productVariant.price * (1 - discountPercentage / 100)

        productMap.set(pp.productVariant.id, {
          variant: pp.productVariant,
          displayPrice: promoPrice,
          tag:
            pp.customDiscount > 0 ? "Giá sốc" : `Giảm ${discountPercentage}%`,
        })
      })
    }

    // Hướng xử lý 2: Nếu apply theo CATEGORY
    if (isCategoryApply && categoryPromotions) {
      categoryPromotions.forEach((cp) => {
        if (!cp.productVariant) return

        const promoPrice =
          cp.customDiscount > 0
            ? cp.customDiscount
            : cp.productVariant.price * (1 - discountPercentage / 100)

        productMap.set(cp.productVariant.id, {
          variant: cp.productVariant,
          displayPrice: promoPrice,
          tag: `Danh mục -${discountPercentage}%`,
        })
      })
    }

    return Array.from(productMap.values())
  }, [
    categoryPromotions,
    discountPercentage,
    isCategoryApply,
    isProductApply,
    productPromotions,
  ])

  // Trạng thái Loading tổng hợp
  const isLoading = loadingProdPromo || loadingCatePromo

  //
  if (isLoading) {
    return (
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
      {/* Tiêu đề nhóm Khuyến mãi */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h4 className="text-md flex items-center gap-2 font-semibold text-gray-700">
          <span className="h-4 w-1 rounded bg-sky-600" />
          {name}
          {image?.url && (
            <div className="h-6 w-8 overflow-hidden">
              <Image
                width={48}
                height={24}
                alt={name}
                src={image.url}
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </h4>
        <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
          {applyType === PromotionApplyType.CATEGORY
            ? "Áp dụng danh mục"
            : "Sản phẩm đặc quyền"}
        </span>
      </div>

      {/* Grid danh sách sản phẩm */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayProducts.length === 0 ? (
          <p className="py-4 text-sm text-gray-400 italic">
            Hiện chưa có sản phẩm nào được áp dụng khuyến mãi này.
          </p>
        ) : (
          <>
            {displayProducts.map(({ variant, displayPrice, tag }) => {
              const thumb = variant.product.thumbnail || "/images/dmx.jpg"

              return (
                <div
                  key={variant.id}
                  className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md"
                >
                  <div>
                    <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
                      <Image
                        width={600}
                        height={600}
                        src={thumb}
                        loading="lazy"
                        alt={variant.sku}
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                      {tag && (
                        <span className="absolute top-1 left-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {tag}
                        </span>
                      )}
                    </div>

                    <p
                      className="line-clamp-2 text-sm font-medium text-gray-800"
                      title={variant.sku}
                    >
                      {variant.sku}
                    </p>
                  </div>

                  <div className="mt-2 border-t border-gray-50 pt-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 line-through">
                        ${variant.price.toFixed(2)}
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        ${displayPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
