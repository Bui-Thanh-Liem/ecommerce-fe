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
} from "@/hooks/apis/use-category"
import { ICategory } from "@/shared/interfaces/models/category.interface"
import { Badge } from "@/components/ui/badge"
import { DataCard } from "@/components/data-card"
import { CategoryHierarchy } from "./category-hierarchy"
import { cn } from "@/lib/utils"

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
    <Card className="relative py-0">
      <div className="relative h-24">
        <Image
          fill // có abs sẵn
          alt={category.name}
          src={category.image?.url || "/placeholder-image.png"}
          className="object-cover"
        />
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
        <Badge variant="destructive">${category.minPrice?.toFixed(2)}</Badge>
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
  const { mutateAsync, isPending } = useDeleteCategory()
  const { data } = useFindAllCategories()
  const metadataCategories = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<ICategory | null>(null)
  const [dataEdit, setDataEdit] = useState<ICategory | null>(null)

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
      />
      <CategoryAction
        open={open}
        dataEdit={dataEdit}
        initialData={initialData}
        onClose={handleClose}
      />
    </>
  )
}
