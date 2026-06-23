"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pencil, Trash } from "lucide-react"
import Image from "next/image"
import { CategoryAction } from "./category-action"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  useDeleteCategory,
  useFindAllCategories,
} from "@/hooks/apis/catalog/use-category"
import { ICategory } from "@/shared/interfaces/models/catalog/category.interface"
import { Badge } from "@/components/ui/badge"
import { DataCard } from "@/components/data-card"
import { CategoryHierarchy } from "./category-hierarchy"
import { cn } from "@/lib/utils"
import { useUrlParams } from "@/hooks/use-url-params"
import { formatVND } from "@/utils/format-vnd.util"

function CategoryCard({
  onEdit,
  category,
  onDelete,
  isPending,
}: {
  isPending?: boolean
  category: ICategory
  onEdit?: (category: ICategory) => void
  onDelete?: (category: ICategory) => void
}) {
  return (
    <Card className="group relative py-0">
      <div className="relative h-24">
        {category.image?.url ? (
          <Image
            fill // có abs sẵn
            alt={category.name}
            src={category.image?.url}
            className="mt-3 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>
      <CardHeader>
        <CardAction className="space-x-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onEdit?.(category)}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-destructive"
            onClick={() => onDelete?.(category)}
          >
            <Trash />
          </Button>
        </CardAction>
        <CardTitle>
          <p className="line-clamp-1">{category.name}</p>
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {category.desc}
        </CardDescription>
      </CardHeader>

      <div>
        {category.parent && (
          <Badge className="absolute top-4 right-4 ml-2 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Parent: {category.parent.name}
          </Badge>
        )}
      </div>

      <div className="absolute top-16 left-4 space-x-2">
        <Badge variant="secondary">{category.code}</Badge>
        <Badge variant="destructive">{formatVND(category.minPrice)}</Badge>
      </div>

      <div className={cn("absolute inset-0 hidden", isPending && "flex")}>
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <span className="font-medium text-amber-700">Processing...</span>
        </div>
      </div>
    </Card>
  )
}

export function CategoryPage() {
  //
  const { params, setParams } = useUrlParams({ page: 1, limit: 10 })

  //
  const { mutateAsync, isPending } = useDeleteCategory()
  const { data } = useFindAllCategories(params)
  const metadataCategories = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<ICategory | null>(null)
  const [initialData, setInitialData] = useState<ICategory | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  // Hàm xóa category
  async function handleDelete(category: ICategory) {
    try {
      const res = await mutateAsync(category.id)
      if (res?.statusCode === 200) {
        setOpen(false)
      }
    } catch (error) {
      console.log("Error delete category :::", error)
    }
  }

  if (!metadataCategories) return null

  return (
    <>
      <DataCard
        dataSource={metadataCategories}
        renderCard={(category) => (
          <CategoryCard
            category={category}
            onEdit={(category) => {
              setOpen(true)
              setDataEdit(category)
            }}
            onDelete={(category) => {
              handleDelete(category)
            }}
            isPending={isPending}
          />
        )}
        onAddCard={() => {
          setOpen(true)
        }}
        tabHeader="Hierarchy"
        tabContent={
          <CategoryHierarchy
            onCreate={(c) => {
              setInitialData(c)
              setOpen(true)
            }}
            onEdit={(c) => {
              setDataEdit(c)
              setOpen(true)
            }}
          />
        }
        onPaginationChange={(paginationState) => {
          setParams({
            page: paginationState.pageIndex + 1,
            limit: paginationState.pageSize,
          })
        }}
      />

      {open && (
        <CategoryAction
          open={open}
          dataEdit={dataEdit}
          initialData={initialData}
          onClose={handleClose}
        />
      )}
    </>
  )
}
