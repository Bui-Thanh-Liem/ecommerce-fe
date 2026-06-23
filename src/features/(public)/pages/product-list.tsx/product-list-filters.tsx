"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRedirectCategoryContext } from "@/context/redirect-category.context"
import {
  useFindBrandsByCategorySlug,
  useFindChildrenCategoryBySlug,
} from "@/hooks/apis/use-filter"
import { cn } from "@/lib/utils"
import { Funnel } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ProductListFiltersProps {
  categorySlug?: string
  parentCategorySlug?: string
}

export function ProductListFilters({
  categorySlug: c,
  parentCategorySlug: pC,
}: ProductListFiltersProps) {
  //
  const router = useRouter()

  //
  const { setData: setDataClickDetail } = useRedirectCategoryContext()

  //
  const { data: brandsData } = useFindBrandsByCategorySlug(c || pC || "")
  const { data } = useFindChildrenCategoryBySlug(c || pC || "")
  const categories = data?.metadata?.data || []
  const brands = brandsData?.metadata?.data || []

  //
  const singleFilter = [
    "Mới nhất",
    "Nổi bật",
    "Bán chạy",
    "Giá thấp đến cao",
    "Giá cao đến thấp",
  ]

  //
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useState<string>(singleFilter[0])

  //
  const handleSelect = (slug: string) => {
    setSelectedCategory(slug)
    setDataClickDetail({
      productSlug: "",
      categoryName: categories.find((c) => c.slug === slug)?.name || "",
    })

    const url = pC ? `/${pC}/${slug}` : `/${slug}`
    router.push(url)
  }

  return (
    <div className="space-y-4 rounded-4xl bg-gray-50 p-4">
      <div className="flex flex-wrap gap-2">
        <FilterAdvanced />
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
              onClick={() => handleSelect(category.slug)}
            >
              {category.name}
            </Button>
          ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {brands.length > 0 &&
          brands.map((brand) => (
            <div
              key={brand.id}
              className="relative h-8 w-24 rounded-full border"
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

      <div className="flex items-center gap-x-2">
        <p className="text-sm text-gray-500">Sắp xếp theo:</p>
        {singleFilter.map((filter) => (
          <Badge
            key={filter}
            className="cursor-pointer"
            onClick={() => setSelectedFilter(filter)}
            variant={selectedFilter === filter ? "default" : "secondary"}
          >
            {filter}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function FilterAdvanced() {
  const priceFilter = [
    "Dưới 1 triệu",
    "1 triệu - 3 triệu",
    "3 triệu - 5 triệu",
    "5 triệu - 10 triệu",
    "Trên 10 triệu",
  ]

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="border-sky-400 text-sky-500 hover:bg-sky-50 hover:text-sky-500"
          >
            <Funnel /> Lọc nâng cao
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bộ lọc nâng cao</DialogTitle>
            <DialogDescription>
              Chọn các tiêu chí để lọc sản phẩm theo nhu cầu của bạn.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
