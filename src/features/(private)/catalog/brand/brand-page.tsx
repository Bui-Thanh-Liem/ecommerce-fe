"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardAction,
  CardDescription,
} from "@/components/ui/card"
import {
  useDeleteBrand,
  useFindAllBrands,
} from "@/hooks/apis/catalog/use-brand"
import { Pencil, Trash } from "lucide-react"
import Image from "next/image"
import { BrandAction } from "./brand-action"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataCard } from "@/components/data-card"
import { cn } from "@/lib/utils"
import { IBrand } from "@/shared/interfaces/models/catalog/brand.interface"

function BrandCard({
  brand,
  onEdit,
  onDelete,
  isPending,
}: {
  brand: IBrand
  isPending?: boolean
  onEdit?: (brand: IBrand) => void
  onDelete?: (brand: IBrand) => void
}) {
  return (
    <Card className="group pt-0">
      <div className="relative h-24">
        {brand.image?.url ? (
          <Image
            fill // có abs sẵn
            alt={brand.name}
            src={brand.image?.url}
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
            onClick={() => onEdit?.(brand)}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="text-destructive"
            onClick={() => onDelete?.(brand)}
          >
            <Trash />
          </Button>
        </CardAction>
        <CardTitle>
          {brand.name} <Badge variant="secondary">{brand.code}</Badge>
        </CardTitle>
        <CardDescription>
          <strong>Country</strong>: {brand.country}
        </CardDescription>
      </CardHeader>

      <div className={cn("absolute inset-0 hidden", isPending && "flex")}>
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 backdrop-blur-sm">
          <span className="font-medium text-amber-700">Processing...</span>
        </div>
      </div>
    </Card>
  )
}

export function BrandPage() {
  //
  const { mutateAsync, isPending } = useDeleteBrand()
  const { data } = useFindAllBrands()
  const metadataBrands = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IBrand | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  // Hàm xóa brand
  async function handleDelete(brand: IBrand) {
    try {
      const res = await mutateAsync(brand.id)
      if (res?.statusCode === 200) {
        setOpen(false)
      }
    } catch (error) {
      console.log("Error delete brand :::", error)
    }
  }

  if (!metadataBrands) return null

  return (
    <>
      <DataCard
        dataSource={metadataBrands}
        renderCard={(brand) => (
          <BrandCard
            brand={brand}
            onEdit={(brand) => {
              setOpen(true)
              setDataEdit(brand)
            }}
            onDelete={(brand) => {
              handleDelete(brand)
            }}
            isPending={isPending}
          />
        )}
        onAddCard={() => {
          setOpen(true)
        }}
      />
      <BrandAction open={open} dataEdit={dataEdit} onClose={handleClose} />
    </>
  )
}
