import { type ColumnDef } from "@tanstack/react-table"
import { ILocationRegion } from "@/shared/interfaces/models/location-region.interface"

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
