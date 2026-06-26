"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import {
  useDeleteMktProgram,
  useFindAllMktPrograms,
} from "@/hooks/apis/mkt-program/use-mkt-program"
import { mktProgramColumns } from "./mkt-program-column"
import { MktProgramAction } from "./mkt-program-action"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { IMarketingProgram } from "@/shared/interfaces/models/mkt-program/marketing-program.interface"
import { MktProgramAddCampaigns } from "./mkt-program-add-campaigns"

export function MktProgramPage() {
  const { mutateAsync, isPending } = useDeleteMktProgram()
  const { data } = useFindAllMktPrograms()
  const metadataMktPrograms = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [openAddCampaign, setOpenAddCampaign] = useState(false)
  const [dataEdit, setDataEdit] = useState<IMarketingProgram | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IMarketingProgram) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  function handleAddCampaign(mktProgram: IMarketingProgram) {
    setDataEdit(mktProgram)
    setOpenAddCampaign(true)
  }

  //
  if (!metadataMktPrograms) return null

  return (
    <>
      <DataTable
        dataSource={metadataMktPrograms}
        columns={mktProgramColumns}
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
              <DropdownMenuItem onClick={() => handleAddCampaign(row.original)}>
                Add campaign
              </DropdownMenuItem>
            </>
          )
        }}
      />

      {open && (
        <MktProgramAction
          open={open}
          dataEdit={dataEdit}
          onClose={handleClose}
        />
      )}

      {openAddCampaign && (
        <MktProgramAddCampaigns
          open={openAddCampaign}
          mktProgram={dataEdit!}
          onClose={() => setOpenAddCampaign(false)}
        />
      )}
    </>
  )
}
