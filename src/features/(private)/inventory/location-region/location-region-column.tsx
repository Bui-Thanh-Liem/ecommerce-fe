import { ILocationRegion } from "@/shared/interfaces/models/inventory/location-region.interface"
import { type ColumnDef } from "@tanstack/react-table"

export const locationRegionColumns: ColumnDef<ILocationRegion>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const store = row.original

      return <p>{store.name}</p>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const store = row.original

      return <p>{store.type}</p>
    },
  },
  {
    accessorKey: "parent",
    header: "Parent",
    cell: ({ row }) => {
      const parent = row.original.parent
      return <p>{parent ? parent.name : "-"}</p>
    },
  },
]
