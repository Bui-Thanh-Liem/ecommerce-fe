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
import { Home, Loader2, ShoppingCart } from "lucide-react"
import { ProductListFilters } from "./product-list-filters"
import { IProductVariant } from "@/shared/interfaces/models/catalog/product-variant.interface"
import { Button } from "@/components/ui/button"
import { useUrlParams } from "@/hooks/use-url-params"

export function ProductListPage({
  categorySlug,
  parentCategorySlug,
}: Partial<ISlugPageProps>) {
  //
  const { params: paramsUrl } = useUrlParams({ s: "newest" } as any) // Mặc định sort là "newest" nếu chưa có trên URL

  //
  const { data } = useRedirectCategoryContext()

  //
  const [currentPage, setCurrentPage] = useState(1)
  const [displayVariants, setDisplayVariants] = useState<IProductVariant[]>([])

  //
  const { data: res, isLoading } = useFindAllByCategorySlugProductVariants(
    categorySlug || parentCategorySlug || "",
    { limit: 50, page: currentPage, filters: paramsUrl }
  )
  const totalItems = res?.metadata?.totalData || 0
  const totalPages = res?.metadata?.totalPage || 0

  // Lắng nghe khi API trả về data mới để gộp vào danh sách cũ
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

  // Reset lại page về 1 nếu slug thay đổi (tránh lỗi khi chuyển danh mục)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1)
  }, [categorySlug])

  // Hàm xử lý khi click nút "Xem thêm"
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  // Kiểm tra xem đã hết sản phẩm chưa
  const hasMore = currentPage < totalPages
  const hasData = displayVariants.length > 0

  if (isLoading && displayVariants.length === 0) {
    return <ProductListPageSkeleton />
  }

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
            {hasData ? (
              <div className="grid grid-cols-5 gap-4">
                {displayVariants.map((v) => (
                  <ProductItem key={v.id} variant={v} />
                ))}
              </div>
            ) : (
              <div className="my-4 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-orange-50 text-orange-500 duration-1000">
                  <ShoppingCart />
                </div>
                <h3 className="mb-1 text-base font-semibold text-gray-900">
                  Danh mục này chưa có sản phẩm
                </h3>
                <p className="mb-6 max-w-xs text-sm text-gray-500">
                  Chúng tôi đang cập nhật các sản phẩm mới nhất. Vui lòng quay
                  lại sau hoặc khám phá danh mục khác nhé!
                </p>
                <Button onClick={() => (window.location.href = "/")}>
                  Quay lại trang chủ
                </Button>
              </div>
            )}

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

function ProductListPageSkeleton() {
  // Giả lập danh sách skeleton cho categories và brands
  const skeletonCategories = Array.from({ length: 5 })
  const skeletonBrands = Array.from({ length: 6 })
  const skeletonProducts = Array.from({ length: 10 }) // Giả lập 2 hàng sản phẩm (mỗi hàng 5 item)
  const skeletonFilters = Array.from({ length: 5 })

  return (
    <div className="grid animate-pulse grid-cols-12 bg-gray-50">
      <div className="col-span-2"></div>

      <div className="col-span-8 py-8">
        <div className="space-y-5 pb-6">
          {/* 1. Breadcrumb Skeleton */}
          <div className="flex h-5 w-64 items-center gap-2 rounded bg-gray-200"></div>

          <div className="space-y-4 rounded-4xl bg-white p-4">
            {/* 2. ProductListFilters Skeleton */}
            <div className="space-y-4 rounded-4xl bg-gray-50 p-4">
              {/* Nút lọc nâng cao & Các nút danh mục */}
              <div className="flex flex-wrap gap-2">
                <div className="h-8 w-28 rounded-md bg-gray-200"></div>{" "}
                {/* Advanced Filter */}
                {skeletonCategories.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-8 w-24 rounded-md bg-gray-200"
                  ></div>
                ))}
              </div>

              {/* Các logo thương hiệu */}
              <div className="flex flex-wrap gap-2">
                {skeletonBrands.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-8 w-24 rounded-full border border-gray-100 bg-gray-200"
                  ></div>
                ))}
              </div>

              {/* Bộ sắp xếp (Sort variants) */}
              <div className="flex items-center gap-x-2">
                <div className="h-4 w-20 rounded bg-gray-200"></div>
                {skeletonFilters.map((_, idx) => (
                  <div
                    key={idx}
                    className="h-5 w-20 rounded-full bg-gray-200"
                  ></div>
                ))}
              </div>
            </div>

            {/* 3. Product Grid Skeleton (5 cột giống code gốc) */}
            <div className="grid grid-cols-5 gap-4">
              {skeletonProducts.map((_, idx) => (
                <div
                  key={idx}
                  className="flex min-h-120 flex-col justify-between gap-2.5 overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5"
                >
                  {/* Top Badge */}
                  <div className="h-4 w-28 rounded bg-gray-200"></div>

                  {/* Image */}
                  <div className="mt-6 flex h-36 w-full items-center justify-center rounded-xl bg-gray-100"></div>

                  {/* Badge Online */}
                  <div className="mt-1 h-4 w-24 rounded bg-gray-200"></div>

                  {/* Product Name */}
                  <div className="min-h-10 space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                  </div>

                  {/* Attributes Tags */}
                  <div className="flex gap-1">
                    <div className="h-5 w-16 rounded bg-gray-200"></div>
                    <div className="h-5 w-20 rounded bg-gray-200"></div>
                  </div>

                  {/* Price Block */}
                  <div className="mt-0.5 flex flex-col gap-1">
                    <div className="h-5 w-28 rounded bg-gray-200"></div>
                    <div className="h-4 w-20 rounded bg-gray-200"></div>
                  </div>

                  {/* Tech Specs Block */}
                  <div className="space-y-1.5 rounded-xl bg-gray-50 px-3 py-1.5">
                    <div className="h-2.5 w-full rounded bg-gray-200"></div>
                    <div className="h-2.5 w-4/5 rounded bg-gray-200"></div>
                  </div>

                  {/* Rating & Sold count */}
                  <div className="mt-0.5 flex items-center gap-2">
                    <div className="h-4 w-10 rounded bg-gray-200"></div>
                    <div className="h-3 w-16 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Load More Button Skeleton */}
            <div className="flex justify-center pt-6 pb-2">
              <div className="h-10 w-56 rounded-xl bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2"></div>
    </div>
  )
}
