"use client"

import { useEffect, useState } from "react"
import { ProductItem } from "@/components/product-item"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useRedirectCategoryContext } from "@/context/redirect-category.context"
import { useFindAllByCategorySlugProductVariants } from "@/hooks/apis/catalog/use-product-variant"
import { ISlugPageProps } from "@/shared/interfaces/common/category-slug-page-detail.interface"
import { Home, Loader2 } from "lucide-react"
import { ProductListFilters } from "./product-list-filters"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"

export function ProductListPage({
  categorySlug,
  parentCategorySlug,
}: Partial<ISlugPageProps>) {
  const { data } = useRedirectCategoryContext()

  const [currentPage, setCurrentPage] = useState(1)
  const [displayVariants, setDisplayVariants] = useState<IProductVariant[]>([])

  const { data: res, isLoading } = useFindAllByCategorySlugProductVariants(
    categorySlug || parentCategorySlug || "",
    { limit: 50, page: currentPage }
  )

  const totalItems = res?.metadata?.totalData || 0
  const totalPages = res?.metadata?.totalPage || 0

  // 4. Lắng nghe khi API trả về data mới để gộp vào danh sách cũ
  useEffect(() => {
    const newVariants = res?.metadata?.data || []
    if (currentPage === 1) {
      // Nếu là trang 1 (hoặc khi đổi category), reset lại data
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayVariants(newVariants)
    } else {
      // Nếu là trang > 1, gộp data mới vào đuôi data cũ
      setDisplayVariants((prev) => [...prev, ...newVariants])
    }
  }, [res, currentPage])

  // 5. Reset lại page về 1 nếu slug thay đổi (tránh lỗi khi chuyển danh mục)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1)
  }, [categorySlug])

  // 6. Hàm xử lý khi click nút "Xem thêm"
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  // Kiểm tra xem đã hết sản phẩm chưa
  const hasMore = currentPage < totalPages

  return (
    <div className="grid grid-cols-12 bg-gray-50">
      <div className="col-span-2"></div>
      <div className="col-span-8 py-8">
        <div className="space-y-5 pb-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home size={18} />
                </BreadcrumbLink>
              </BreadcrumbItem>

              {categorySlug ? (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${parentCategorySlug}`}>
                      {data?.parentCategoryName}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <strong>{totalItems}</strong> {data?.categoryName}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <strong>{totalItems}</strong> {data?.parentCategoryName}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-4 rounded-4xl bg-white p-4">
            <ProductListFilters
              categorySlug={categorySlug}
              parentCategorySlug={parentCategorySlug}
            />

            {/* Thay `variants.map` bằng `displayVariants.map` */}
            <div className="grid grid-cols-5 gap-4">
              {displayVariants.map((v) => (
                <ProductItem key={v.id} variant={v} />
              ))}
            </div>

            {/* 7. Khu vực nút Xem thêm */}
            {hasMore && (
              <div className="flex justify-center pt-6 pb-2">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    `Xem thêm sản phẩm (Còn ${totalItems - displayVariants.length} sản phẩm)`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2"></div>
    </div>
  )
}
