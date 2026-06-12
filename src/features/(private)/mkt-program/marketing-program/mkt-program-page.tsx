"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import {
  useDeleteMktProgram,
  useFindAllMktPrograms,
} from "@/hooks/apis/use-mkt-program"
import { IMarketingProgram } from "@/shared/interfaces/models/marketing-program.interface"
import { mktProgramColumns } from "./mkt-program-column"
import { MktProgramAction } from "./mkt-program-action"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function MktProgramPage() {
  const { mutateAsync, isPending } = useDeleteMktProgram()
  const { data } = useFindAllMktPrograms()
  const metadataMktPrograms = data?.metadata

  //
  const [open, setOpen] = useState(false)
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
    console.log("Adding campaign for program:", mktProgram)
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
                Add Campaign
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
    </>
  )
}
