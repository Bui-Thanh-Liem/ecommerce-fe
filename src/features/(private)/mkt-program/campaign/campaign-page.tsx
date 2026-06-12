"use client"

import {
  useDeleteCampaign,
  useFindAllCampaigns,
} from "@/hooks/apis/mkt-program/use-campaign"
import { useState } from "react"
import { campaignColumns } from "./campaign-column"
import { DataTable } from "@/components/data-table"
import { CampaignAction } from "./campaign-action"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"

export function CampaignPage() {
  const router = useRouter()
  const { mutateAsync, isPending } = useDeleteCampaign()
  const { data } = useFindAllCampaigns()
  const metadataCampaigns = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<ICampaign | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: ICampaign) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  function handleCreatePromotion(campaign: ICampaign) {
    router.push(`/promotions?c=${campaign.id}`)
  }

  //
  if (!metadataCampaigns) return null

  return (
    <>
      <DataTable
        dataSource={metadataCampaigns}
        columns={campaignColumns}
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
                onClick={() => handleCreatePromotion(row.original)}
              >
                Create promotion
              </DropdownMenuItem>
            </>
          )
        }}
      />

      {open && (
        <CampaignAction open={open} dataEdit={dataEdit} onClose={handleClose} />
      )}
    </>
  )
}
