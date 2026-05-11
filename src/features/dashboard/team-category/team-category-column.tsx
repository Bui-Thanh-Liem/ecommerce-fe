import { type ColumnDef } from "@tanstack/react-table"
import { ITeamCategory } from "@/shared/interfaces/models/team-category.interface"

export const teamCategoryColumns: ColumnDef<ITeamCategory>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p>{row.original.name}</p>
    },
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      return <p>{row.original.code}</p>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <p>{row.original.type}</p>
    },
  },
]
