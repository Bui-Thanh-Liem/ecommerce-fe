"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRedirectCategoryContext } from "@/context/redirect-category.context"
import { useCountProductsByCategorySlug } from "@/hooks/apis/catalog/use-product-variant"
import {
  useFindAttributesByCategorySlug,
  useFindBrandsByCategorySlug,
  useFindChildrenCategoryBySlug,
} from "@/hooks/apis/use-filter"
import { useDebounce } from "@/hooks/use-debounce"
import { useUrlParams } from "@/hooks/use-url-params"
import { cn } from "@/lib/utils"
import { IBrand } from "@/shared/interfaces/models/catalog/brand.interface"
import { ICategory } from "@/shared/interfaces/models/catalog/category.interface"
import { Funnel } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

interface ProductListFiltersProps {
  categorySlug?: string
  parentCategorySlug?: string
}

type SortOption = (typeof SORT_OPTIONS)[number]

const FILTER_SORT_ITEMS: { label: string; value: SortOption }[] = [
  { label: "Mới nhất", value: "newest" },
  { label: "Nổi bật", value: "standout" },
  { label: "Bán chạy", value: "best_seller" },
  { label: "Giá thấp đến cao", value: "price_asc" },
  { label: "Giá cao đến thấp", value: "price_desc" },
]

/**
 * b: brand slug
 * s: sort
 * fa: { key: value } (key là attribute key, value là attribute value)
 */

export function ProductListFilters({
  categorySlug: c,
  parentCategorySlug: pC,
}: ProductListFiltersProps) {
  const router = useRouter()

  // Giả định các custom hooks của bạn hoạt động như cũ
  const { params, setParams } = useUrlParams({} as any)
  const b = params?.b || ""
  const currentSortParam = params?.s || "newest" // Mặc định nếu chưa có sort trên URL

  const { setData: setDataClickDetail } = useRedirectCategoryContext()

  //
  const slugToUse = c || pC || ""
  const { data: brandsData } = useFindBrandsByCategorySlug(slugToUse)
  const { data } = useFindChildrenCategoryBySlug(slugToUse)
  const categories = data?.metadata?.data || []
  const brands = brandsData?.metadata?.data || []

  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // Thay đổi danh mục (Category)
  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug)
    setDataClickDetail({
      productSlug: "",
      categoryName: categories.find((item) => item.slug === slug)?.name || "",
    })

    const url = pC ? `/${pC}/${slug}` : `/${slug}`
    router.push(url)
  }

  // Bật / Tắt thương hiệu (Brand)
  const handleToggleBrand = (slug: string) => {
    setParams({
      b: b === slug ? undefined : slug,
    })
  }

  // Xử lý khi click chọn Sort (Giá thấp đến cao sẽ truyền "price_asc")
  const handleSelectFilter = (value: SortOption) => {
    setParams({
      s: value, // Đẩy key "price_asc" lên URL parameter `s`
    })
  }

  return (
    <div className="space-y-4 rounded-4xl bg-gray-50 p-4">
      <div className="flex flex-wrap gap-2">
        <FilterAdvanced
          brands={brands}
          slugToUse={slugToUse}
          categories={categories}
        />

        {/* Sub Categories */}
        {categories.length > 0 &&
          categories.map((category) => (
            <Button
              size="sm"
              key={category.id}
              variant="outline"
              className={cn({
                "border-sky-100 bg-sky-50 text-sky-500 hover:bg-sky-50 hover:text-sky-400":
                  selectedCategory === category.slug,
              })}
              onClick={() => handleSelectCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
      </div>

      {/* Brands */}
      <div className="flex flex-wrap gap-2">
        {brands.length > 0 &&
          brands.map((brand) => (
            <div
              key={brand.id}
              className={cn(
                "relative h-8 w-24 cursor-pointer overflow-hidden rounded-full border",
                {
                  "border-sky-400 bg-sky-50 text-sky-500": b === brand.slug,
                }
              )}
              onClick={() => handleToggleBrand(brand.slug)}
            >
              <Image
                fill
                alt={brand.name}
                src={brand.image.url}
                className="scale-80 object-cover"
              />
            </div>
          ))}
      </div>

      {/* Filter sort (Bộ lọc sắp xếp giá) */}
      <div className="flex items-center gap-x-2">
        <p className="text-sm text-gray-500">Sắp xếp theo:</p>
        {FILTER_SORT_ITEMS.map((item) => (
          <Badge
            key={item.value}
            className="cursor-pointer"
            // Gọi hàm xử lý truyền key tiếng Anh ra URL, đồng thời kích hoạt UI active
            onClick={() => handleSelectFilter(item.value)}
            variant={currentSortParam === item.value ? "default" : "secondary"}
          >
            {item.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function FilterAdvanced({
  brands,
  slugToUse,
  categories,
}: {
  brands: IBrand[]
  slugToUse: string
  categories: ICategory[]
}) {
  const { params, setParams } = useUrlParams({} as any)

  //
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >(() => {
    try {
      return params?.fa ? JSON.parse(params.fa) : {}
    } catch {
      return {}
    }
  })

  //
  const debouncedSelectedFilters = useDebounce(selectedFilters)
  const countParams = useMemo(
    () => ({
      filters: { fa: JSON.stringify(debouncedSelectedFilters) },
    }),
    [debouncedSelectedFilters]
  )

  //
  const { data: countData } = useCountProductsByCategorySlug(
    slugToUse,
    countParams
  )
  const { data: attributesData } = useFindAttributesByCategorySlug(slugToUse)
  const attributes = attributesData?.metadata || []

  //
  function handleToggleFilter(key: string, value: string) {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      if (newFilters[key] === value) {
        delete newFilters[key]
      } else {
        newFilters[key] = value
      }
      return newFilters
    })
  }

  //
  function handleApplyFilters() {
    setParams({
      fa: JSON.stringify(selectedFilters),
    })
  }

  //
  function handleClearFilters() {
    setSelectedFilters({})

    setParams({
      fa: undefined,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-sky-400 text-sky-500 hover:bg-sky-50 hover:text-sky-500"
        >
          <Funnel /> Lọc nâng cao{" "}
          {selectedFilters && Object.keys(selectedFilters).length > 0 && (
            <span className="ml-1 rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
              {Object.keys(selectedFilters).length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-x-2">
            Bộ lọc nâng cao{" "}
            <span className="text-gray-500 italic">
              (thuộc trang hiện tại bạn đang xem)
            </span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-200px)] space-y-4 overflow-x-hidden overflow-y-auto px-1">
          {/* Sub Categories */}
          {categories?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Danh mục</p>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 &&
                  categories.map((category) => (
                    <Button
                      size="sm"
                      key={category.id}
                      variant="outline"
                      className={cn({
                        "border-sky-100 bg-sky-50 text-sky-500 hover:bg-sky-50 hover:text-sky-400":
                          selectedFilters["c"] === category.slug,
                      })}
                      onClick={() => {
                        handleToggleFilter("c", category.slug)
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {brands?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Thương hiệu</p>
              <div className="flex flex-wrap gap-2">
                {brands.length > 0 &&
                  brands.map((brand) => (
                    <div
                      key={brand.id}
                      className={cn(
                        "relative h-8 w-24 cursor-pointer overflow-hidden rounded-full border",
                        {
                          "border-sky-400 bg-sky-50 text-sky-500":
                            selectedFilters["b"] === brand.slug,
                        }
                      )}
                      onClick={() => {
                        handleToggleFilter("b", brand.slug)
                      }}
                    >
                      <Image
                        fill
                        alt={brand.name}
                        src={brand.image.url}
                        className="scale-80 object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Attributes */}
          {attributes?.length > 0 &&
            attributes.map((attr) => (
              <div key={attr.key} className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {attr.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {attr.options.length > 0 &&
                    attr.options.map((option) => (
                      <Button
                        size="sm"
                        key={option.value}
                        variant="outline"
                        className={cn({
                          "border-sky-100 bg-sky-50 text-sky-500 hover:bg-sky-50 hover:text-sky-400":
                            selectedFilters[attr.key] === option.value,
                        })}
                        onClick={() => {
                          handleToggleFilter(attr.key, option.value)
                        }}
                      >
                        {option.desc}
                      </Button>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <DialogFooter>
          <Button variant="destructive" onClick={handleClearFilters}>
            Xóa bộ lọc
          </Button>

          <Button onClick={handleApplyFilters}>
            Xem {countData?.metadata?.count || 0} sản phẩm phù hợp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
