import { Active } from "@/components/active"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateMenu } from "@/hooks/apis/store-front/use-menu"
import { IMenu } from "@/shared/interfaces/models/store-front/menu.interface"
import { ColumnDef, Row } from "@tanstack/table-core"

//
const StatusCell = ({ row }: { row: Row<IMenu> }) => {
  const { mutate } = useUpdateMenu()

  function toggleActiveStatus() {
    mutate({
      id: row.original.id,
      payload: {
        isActive: !row.original.isActive,
      },
    })
  }

  return (
    <span className="cursor-pointer" onClick={toggleActiveStatus}>
      <Active isActive={row.original.isActive} />
    </span>
  )
}

export const menuColumns: ColumnDef<IMenu>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p>{row.original.name || "-"}</p>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <p>{row.original.category?.name || "-"}</p>
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: StatusCell,
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.original.desc
      if (!desc) return <p>-</p>

      return <Textarea value={desc} readOnly />
    },
  },
]
