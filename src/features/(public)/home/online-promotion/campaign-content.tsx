"use client"

import { useFindOptionsProducts } from "@/hooks/apis/catalog/use-product"
import { useFindOptionsCategoryPromotions } from "@/hooks/apis/mkt-program/use-category-promotion"
import { useFindOptionsProductPromotions } from "@/hooks/apis/mkt-program/use-product-promotion"
// Giả định đường dẫn hook lấy product theo filter của bạn, hãy điều chỉnh cho đúng thực tế

interface CampaignContentProps {
  campaignId: string
  name: string
  desc?: string
}

export function CampaignContent({
  campaignId,
  name,
  desc,
}: CampaignContentProps) {
  // 1. Fetch khuyến mãi theo sản phẩm trực tiếp
  const { data: productPromotionsRes, isLoading: loadingProdPromo } =
    useFindOptionsProductPromotions({
      filters: { promotion: campaignId as any },
    })
  const productPromotions = productPromotionsRes?.metadata?.data || []

  // 2. Fetch khuyến mãi theo danh mục
  const { data: categoryPromotionsRes, isLoading: loadingCatePromo } =
    useFindOptionsCategoryPromotions({
      filters: { promotion: campaignId as any },
    })
  const categoryPromotions = categoryPromotionsRes?.metadata?.data || []

  // Lấy ra danh sách các categoryId có trong khuyến mãi này
  const categoryIds = categoryPromotions
    .map((cp) => cp.category)
    .filter(Boolean)

  // 3. Nếu có khuyến mãi theo danh mục, fetch danh sách sản phẩm của các danh mục đó
  // Lưu ý: Cần tùy biến hook của bạn để nhận mảng ID hoặc xử lý vòng lặp nếu hook chỉ nhận 1 ID.
  // Dưới đây truyền theo mảng, nếu hook chỉ nhận string, bạn truyền categoryIds[0] hoặc tùy biến map.
  const { data: productsByCateRes, isLoading: loadingProdByCate } =
    useFindOptionsProducts({
      filters: { category: categoryIds as any },
      // enabled: categoryIds.length > 0 // Mở ra nếu hook có hỗ trợ cấu hình hoãn fetch khi mảng rỗng
    })
  const productsFromCategories = productsByCateRes?.metadata?.data || []

  const isLoading = loadingProdPromo || loadingCatePromo || loadingProdByCate

  if (isLoading) {
    return (
      <p className="animate-pulse text-sm text-gray-500">
        Đang tải sản phẩm...
      </p>
    )
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold text-sky-800">{name}</h3>
        {desc && <p className="text-sm text-gray-500">{desc}</p>}
      </div>

      {/* KHU VỰC RENDER SẢN PHẨM */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {/* Trường hợp 1: Có sản phẩm khuyến mãi trực tiếp */}
        {productPromotions.length > 0 &&
          productPromotions.map((pp) => (
            <div
              key={pp.id}
              className="rounded-xl border bg-gray-50 p-3 shadow-sm"
            >
              {/* Thay các trường hiển thị pp.product.name, pp.product.image... đúng với cấu trúc data của bạn */}
              <p className="line-clamp-2 text-sm font-medium">
                {pp.productVariant?.sku || "Sản phẩm khuyến mãi"}
              </p>
              <span className="text-xs font-bold text-red-500">
                Giá KM: {pp.customDiscount?.toLocaleString()}đ
              </span>
            </div>
          ))}

        {/* Trường hợp 2: Có sản phẩm lấy được từ Khuyến mãi Danh mục */}
        {productsFromCategories.length > 0 &&
          productsFromCategories.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border bg-gray-50 p-3 shadow-sm"
            >
              {/* Render thông tin product trực tiếp */}
              <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
              <span className="text-xs font-medium text-sky-600">
                Theo danh mục
              </span>
            </div>
          ))}

        {/* Trường hợp cả 2 đều trống */}
        {productPromotions.length === 0 &&
          productsFromCategories.length === 0 && (
            <p className="col-span-full text-sm text-gray-400 italic">
              Chưa có sản phẩm nào trong chiến dịch này.
            </p>
          )}
      </div>
    </div>
  )
}
