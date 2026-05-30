"use client"

import { DataTable } from "@/components/data-table"
import {
  useDeletePromotion,
  useFindAllPromotions,
} from "@/hooks/apis/use-promotion"
import { promotionColumns } from "./promotion-column"
import { useState } from "react"
import { IPromotion } from "@/shared/interfaces/models/promotion.interface"
import { PromotionAction } from "./promotion-action"

export function PromotionPage() {
  const { mutateAsync, isPending } = useDeletePromotion()
  const { data: promotions } = useFindAllPromotions()
  const metadataPromotions = promotions?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IPromotion | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IPromotion) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  if (!metadataPromotions) return null

  return (
    <>
      <DataTable
        dataSource={metadataPromotions}
        columns={promotionColumns}
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

      {open && (
        <PromotionAction
          open={open}
          dataEdit={dataEdit}
          onClose={handleClose}
        />
      )}
    </>
  )
}
