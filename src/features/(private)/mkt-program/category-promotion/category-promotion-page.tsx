"use client"

import { DataTable } from "@/components/data-table"
import {
  useDeleteCategoryPromotion,
  useFindAllCategoryPromotions,
} from "@/hooks/apis/mkt-program/use-category-promotion"
import { useState } from "react"
import { categoryPromotionColumns } from "./category-promotion-column"
import { CategoryPromotionAction } from "./category-promotion-action"
import { useRouter, useSearchParams } from "next/navigation"
import { ICategoryPromotion } from "@/shared/interfaces/models/mkt-program/category-promotion.interface"

export function CategoryPromotionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const promotionId = searchParams.get("p")

  const { mutateAsync, isPending } = useDeleteCategoryPromotion()
  const { data } = useFindAllCategoryPromotions()
  const metadataPromotions = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<ICategoryPromotion | null>(null)

  //
  function handleClose() {
    if (promotionId) router.push("/marketing-programs/category-promotions")
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: ICategoryPromotion) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  const initialData = promotionId
    ? ({ promotion: { id: promotionId } } as ICategoryPromotion)
    : null
  const dialogOpen = open || !!promotionId

  //
  if (!metadataPromotions) return null

  return (
    <>
      <DataTable
        dataSource={metadataPromotions}
        columns={categoryPromotionColumns}
        //
        onAddRow={() => setOpen(true)}
        onEditRow={(row) => {
          setOpen(true)
          setDataEdit(row.original)
        }}
        onDeleteRow={(row) => {
          handleDeleteRow(row.original)
        }}
        isPending={isPending}
      />

      {dialogOpen && (
        <CategoryPromotionAction
          open={dialogOpen}
          dataEdit={dataEdit}
          onClose={handleClose}
          initialData={initialData}
        />
      )}
    </>
  )
}
