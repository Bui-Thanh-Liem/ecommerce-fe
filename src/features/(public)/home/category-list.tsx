"use client"

import { Badge } from "@/components/ui/badge"
import { useFindOptionsCategories } from "@/hooks/apis/use-category"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const maxCategoriesToShow = 15

export function CategoryList() {
  const { data } = useFindOptionsCategories()
  const categories = data?.metadata?.data || []

  //
  if (categories.length === 0) return null

  //
  return (
    <div className="mx-auto overflow-hidden rounded-4xl border-2 border-sky-700 bg-white">
      <div className="grid grid-cols-8 gap-4">
        {categories.slice(0, maxCategoriesToShow)?.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="relative flex cursor-pointer flex-col items-center space-y-3 rounded-2xl p-2 pt-6 hover:bg-slate-100"
          >
            <Image
              src={category.image.url}
              alt={category.name}
              width={44}
              height={44}
              className="h-11 w-11 overflow-hidden rounded-md object-cover"
            />
            <p className="line-clamp-2 max-w-32 text-center text-xs">
              {category.name}
            </p>
            {Boolean(category?.minPrice && category?.minPrice > 0) && (
              <Badge
                variant="destructive"
                className="absolute top-4 right-0 bg-red-50"
              >
                ${category?.minPrice?.toFixed(2)}
              </Badge>
            )}
          </Link>
        ))}
        {categories.length > maxCategoriesToShow && (
          <Link
            href="/categories"
            className="relative flex cursor-pointer flex-col items-center space-y-3 rounded-2xl p-2 pt-6 hover:bg-slate-100"
          >
            <Menu className="h-11 w-11 text-sky-600" />
            <p className="text-xs">Tất cả danh mục</p>
          </Link>
        )}
      </div>
    </div>
  )
}
