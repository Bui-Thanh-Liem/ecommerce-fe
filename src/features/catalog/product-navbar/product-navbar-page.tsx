"use client"

import { DataTable } from "@/components/data-table"
import {
  useDeleteProductNavbar,
  useFindAllProductNavbars,
} from "@/hooks/apis/use-product-navbar"
import { productNavbarColumns } from "./product-navbar-column"
import { useState } from "react"
import { IProductNavbar } from "@/shared/interfaces/models/navbar.interface"
import { ProductNavbarAction } from "./product-navbar-action"

export function ProductNavbarPage() {
  const { mutateAsync, isPending } = useDeleteProductNavbar()
  const { data } = useFindAllProductNavbars()
  const metadataProductNavbars = data?.metadata

  //
  const [open, setOpen] = useState(false)
  const [dataEdit, setDataEdit] = useState<IProductNavbar | null>(null)

  //
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)

    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: IProductNavbar) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  //
  if (!metadataProductNavbars) return null

  return (
    <>
      <DataTable
        dataSource={metadataProductNavbars}
        columns={productNavbarColumns}
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

      <ProductNavbarAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
      />
    </>
  )
}
