"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeaderAction,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useRedirectCategoryContext } from "@/context/redirect-category.context"
import { useFindOptionsCategories } from "@/hooks/apis/catalog/use-category"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import { formatVND } from "@/utils/format-vnd.util"
import { LayoutGrid, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CategoryListSection() {
  const { listCategories } = useGetStoreFront()
  const { setData } = useRedirectCategoryContext()

  //
  if (listCategories.length === 0) return null

  //
  return (
    <div className="mx-auto overflow-hidden rounded-4xl border-2 border-sky-700 bg-white px-1">
      <div className="grid grid-cols-8 gap-4">
        {listCategories.map((category) => (
          <Link
            key={category.id}
            href={`/${category.slug}`}
            className="relative flex cursor-pointer flex-col items-center space-y-3 rounded-2xl p-2 pt-6 hover:bg-slate-100"
            onClick={() => {
              setData({
                parentCategoryName: category.name,
              })
            }}
          >
            {category.image ? (
              <Image
                width={44}
                height={44}
                alt={category.name}
                src={category.image.url}
                className="h-11 w-11 overflow-hidden rounded-md object-cover"
              />
            ) : (
              <LayoutGrid size={16} className="h-11 w-11 text-sky-600" />
            )}

            <p className="line-clamp-2 max-w-32 text-center text-xs">
              {category.name}
            </p>
            {Boolean(category?.minPrice && category?.minPrice > 0) && (
              <Badge
                variant="destructive"
                className="absolute top-4 right-0 bg-red-50"
              >
                {formatVND(category.minPrice)}
              </Badge>
            )}
          </Link>
        ))}

        <Categories />
      </div>
    </div>
  )
}

export function Categories() {
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const { setData } = useRedirectCategoryContext()

  // 1. Handle Debounce delay 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchValue])

  // Sử dụng giá trị đã debounced để kích hoạt API gọi lại
  // Thêm biến `isLoading` hoặc `isFetching` tùy thuộc vào custom hook của bạn trả về gì (thường là isLoading hoặc từ react-query)
  const { data, isLoading } = useFindOptionsCategories({
    filters: { name: debouncedSearch },
    limit: 100,
    page: 1,
  })

  const categories = data?.metadata?.data || []

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex h-auto w-auto cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl p-0 pt-3 hover:bg-slate-100"
          variant="ghost"
        >
          <Menu className="h-12! w-12! text-sky-600" size={120} />
          <p className="text-xs">Tất cả danh mục</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-6xl">
        <DialogHeaderAction title="" desc="" />

        <div className="mb-6 flex">
          <Input
            value={searchValue}
            className="mx-auto w-96"
            placeholder="Tìm kiếm danh mục..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-8 gap-4">
          {/* 2. Hiển thị Skeleton khi đang loading hoặc khi searchValue thực tế khác với giá trị debounced (đang gõ) */}
          {isLoading || searchValue !== debouncedSearch ? (
            Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-3 rounded-2xl p-2 pt-6"
              >
                <Skeleton className="h-11 w-11 rounded-md bg-slate-200" />
                <Skeleton className="h-4 w-20 bg-slate-200" />
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="relative flex cursor-pointer flex-col items-center space-y-3 rounded-2xl p-2 pt-6 hover:bg-slate-100"
                onClick={() => {
                  setData({
                    parentCategoryName: category.name,
                  })
                }}
              >
                {category.image ? (
                  <Image
                    width={44}
                    height={44}
                    alt={category.name}
                    src={category.image.url}
                    className="h-11 w-11 overflow-hidden rounded-md object-cover"
                  />
                ) : (
                  <LayoutGrid size={16} className="h-11 w-11 text-sky-600" />
                )}

                <p className="line-clamp-2 max-w-32 text-center text-xs">
                  {category.name}
                </p>
                {Boolean(category?.minPrice && category?.minPrice > 0) && (
                  <Badge
                    variant="destructive"
                    className="absolute top-4 right-0 bg-red-50"
                  >
                    {formatVND(category.minPrice)}
                  </Badge>
                )}
              </Link>
            ))
          ) : (
            <div className="col-span-12 py-8 text-center text-sm text-slate-400">
              Không tìm thấy danh mục nào phù hợp.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
