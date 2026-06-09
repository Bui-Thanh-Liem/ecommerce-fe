"use client"

import { Badge } from "@/components/ui/badge"
import { useFindAllCategories } from "@/hooks/apis/use-category"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const maxCategoriesToShow = 15

export function CategoryList() {
  const { data } = useFindAllCategories()
  const categories = data?.metadata?.data || []

  const mockCategories = Array.from(
    { length: maxCategoriesToShow },
    (_, index) =>
      categories.map((item) => ({
        ...item,
        id: `${item.id}-${index}`, // tránh key trùng nhau
      }))
  ).flat()

  return (
    <div className="mx-auto overflow-hidden rounded-4xl border-2 border-sky-700 bg-white">
      <div className="grid grid-cols-8 gap-4">
        {mockCategories.map((category) => (
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
            <p className="line-clamp-2 max-w-32 text-xs">{category.name}</p>
            {category?.minPrice && category?.minPrice > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-2 right-0 bg-red-50"
              >
                ${category?.minPrice?.toFixed(2)}
              </Badge>
            )}
          </Link>
        ))}
        <Link
          href="/categories"
          className="relative flex cursor-pointer flex-col items-center space-y-3 rounded-2xl p-2 pt-6 hover:bg-slate-100"
        >
          <Menu className="h-11 w-11 text-sky-600" />
          <p className="text-xs">Tất cả danh mục</p>
        </Link>
      </div>
    </div>
  )
}
