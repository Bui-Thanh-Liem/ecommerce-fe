"use client"

import { DataTable } from "@/components/data-table"
import {
  useDeleteMenu,
  useFindAllMenus,
} from "@/hooks/apis/store-front/use-menu"
import { menuColumns } from "./menu-column"
import { useState } from "react"
import { MenuAction } from "./menu-action"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"

export function MenuPage() {
  const { mutateAsync, isPending } = useDeleteMenu()
  const { data } = useFindAllMenus()
  const metadataMenus = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IMenu | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IMenu) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  if (!metadataMenus) return null

  return (
    <>
      <DataTable
        dataSource={metadataMenus}
        columns={menuColumns}
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

      <MenuAction open={open} dataEdit={dataEdit} onClose={handleClose} />
    </>
  )
}
