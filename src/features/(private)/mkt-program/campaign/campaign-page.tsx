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
import { useRouter, useSearchParams } from "next/navigation"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"

export function CampaignPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mktProgramId = searchParams.get("m")

  const { mutateAsync, isPending } = useDeleteCampaign()
  const { data } = useFindAllCampaigns()
  const metadataCampaigns = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<ICampaign | null>(null)

  //
  function handleClose() {
    if (mktProgramId) router.push("/marketing-programs/campaigns")
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
  const initialData = mktProgramId
    ? ({ marketingProgram: { id: mktProgramId } } as ICampaign)
    : null
  const dialogOpen = open || !!mktProgramId

  //
  function handleCreatePromotion(campaign: ICampaign) {
    router.push(`/marketing-programs/promotions?c=${campaign.id}`)
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

      {dialogOpen && (
        <CampaignAction
          open={dialogOpen}
          dataEdit={dataEdit}
          onClose={handleClose}
          initialData={initialData}
        />
      )}
    </>
  )
}
