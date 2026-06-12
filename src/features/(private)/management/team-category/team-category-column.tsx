import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TeamType } from "@/shared/enums/team-type.enum"
import { randomColorByString } from "@/utils/random-color-by-string.util"
import { ITeamCategory } from "@/shared/interfaces/models/management/team-category.interface"

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
      const code = row.original.code
      return <Badge className={randomColorByString(code)}>{code}</Badge>
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type
      return (
        <Badge
          className={cn(
            type === TeamType.HEADQUARTER
              ? "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
              : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          )}
        >
          {type}
        </Badge>
      )
    },
  },
]
