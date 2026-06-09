import { Active } from "@/components/active"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateProductNavbar } from "@/hooks/apis/use-product-navbar"
import { IProductNavbar } from "@/shared/interfaces/models/product-navbar.interface"
import { ColumnDef, Row } from "@tanstack/table-core"

//
const StatusCell = ({ row }: { row: Row<IProductNavbar> }) => {
  const { mutate } = useUpdateProductNavbar()

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

export const productNavbarColumns: ColumnDef<IProductNavbar>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p>{row.original.name || "-"}</p>
    },
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={row.original.link || "#"}
          className="text-blue-400 underline"
        >
          {row.original.link || "-"}
        </a>
      )
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => {
      return <p>{row.original.slug || "-"}</p>
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
