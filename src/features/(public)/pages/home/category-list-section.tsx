"use client"

import { Badge } from "@/components/ui/badge"
import { useGetStoreFront } from "@/hooks/use-get-store-front"
import { formatVND } from "@/utils/format-vnd.util"
import { LayoutGrid, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CategoryListSection() {
  const { listCategories } = useGetStoreFront()

  //
  if (listCategories.length === 0) return null

  //
  return (
    <div className="mx-auto overflow-hidden rounded-4xl border-2 border-sky-700 bg-white px-1">
      <div className="grid grid-cols-8 gap-4">
        {listCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="relative flex cursor-pointer flex-col items-center space-y-3 rounded-2xl p-2 pt-6 hover:bg-slate-100"
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
