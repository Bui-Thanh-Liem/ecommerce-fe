"use client"

import {
  useDeleteLocationRegions,
  useFindAllLocationRegions,
} from "@/hooks/apis/inventory/use-location-region"
import { useState } from "react"
import { locationRegionColumns } from "./location-region-column"
import { LocationRegionAction } from "./location-region-action"
import { LocationRegionHierarchy } from "./location-region-hierarchy"
import { DataTable } from "@/components/data-table"
import { ILocationRegion } from "@/shared/interfaces/models/inventory/location-region.interface"

export function LocationRegionPage() {
  const { mutateAsync } = useDeleteLocationRegions()
  const { data } = useFindAllLocationRegions({
    page: 1,
    limit: 20,
  })
  const metaDataLocationRegions = data?.metadata

  // State quản lý dialog
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState<ILocationRegion | null>(null)
  const [dataEdit, setDataEdit] = useState<ILocationRegion | null>(null)

  // Hàm này sẽ được gọi khi dialog đóng, giúp reset dataEdit sau khi đóng dialog
  function handleClose() {
    setOpen(false)
    const id = setTimeout(() => {
      setDataEdit(null)
    }, 100)
    return () => clearTimeout(id)
  }

  //
  async function handleDeleteRow(row: ILocationRegion) {
    const res = await mutateAsync(row.id)
    if (res?.statusCode === 200) {
      setOpen(false)
    }
  }

  if (!metaDataLocationRegions) return null

  return (
    <>
      <DataTable
        dataSource={metaDataLocationRegions}
        columns={locationRegionColumns}
        //
        onAddRow={() => setOpen(true)}
        onEditRow={(row) => {
          setOpen(true)
          setDataEdit(row.original)
        }}
        onDeleteRow={(row) => {
          handleDeleteRow(row.original)
        }}
        //
        tabHeader="Hierarchy"
        tabContent={
          <LocationRegionHierarchy
            onCreate={(staff) => {
              setOpen(true)
              setInitialData(staff)
            }}
            onEdit={(staff) => {
              setOpen(true)
              setDataEdit(staff)
            }}
            onDelete={(staff) => handleDeleteRow(staff)}
          />
        }
      />

      <LocationRegionAction
        open={open}
        dataEdit={dataEdit}
        onClose={handleClose}
        initialData={initialData}
      />
    </>
  )
}
