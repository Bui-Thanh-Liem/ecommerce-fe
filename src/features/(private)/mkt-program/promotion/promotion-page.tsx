"use client"

import { DataTable } from "@/components/data-table"
import {
  useDeletePromotion,
  useFindAllPromotions,
} from "@/hooks/apis/mkt-program/use-promotion"
import { promotionColumns } from "./promotion-column"
import { useState } from "react"
import { IPromotion } from "@/shared/interfaces/models/mkt-program/promotion.interface"
import { PromotionAction } from "./promotion-action"
import { useRouter, useSearchParams } from "next/navigation"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function PromotionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("c")

  const { mutateAsync, isPending } = useDeletePromotion()
  const { data: promotions } = useFindAllPromotions()
  const metadataPromotions = promotions?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IPromotion | null>(null)

  //
  function handleClose() {
    if (campaignId) router.push("/promotions")
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
  const initialData = campaignId
    ? ({ campaign: { id: campaignId } } as IPromotion)
    : null
  const dialogOpen = open || !!campaignId

  //
  function handleCreateCatePromotion(campaign: IPromotion) {
    router.push(`/category-promotions?p=${campaign.id}`)
  }

  //
  function handleCreateProdPromotion(campaign: IPromotion) {
    router.push(`/product-promotions?p=${campaign.id}`)
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
        extraAction={(row) => {
          return (
            <>
              <DropdownMenuItem
                onClick={() => handleCreateCatePromotion(row.original)}
              >
                Create category promotion
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCreateProdPromotion(row.original)}
              >
                Create product promotion
              </DropdownMenuItem>
            </>
          )
        }}
      />

      {dialogOpen && (
        <PromotionAction
          open={dialogOpen}
          dataEdit={dataEdit}
          onClose={handleClose}
          initialData={initialData}
        />
      )}
    </>
  )
}
