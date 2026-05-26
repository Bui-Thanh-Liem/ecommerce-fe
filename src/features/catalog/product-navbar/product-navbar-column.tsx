import { Textarea } from "@/components/ui/textarea"
import { IProductNavbar } from "@/shared/interfaces/models/navbar.interface"
import { ColumnDef } from "@tanstack/table-core"

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
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.original.desc
      if (!desc) return <p>-</p>

      return <Textarea value={desc} readOnly />
    },
  },
]
