import { Textarea } from "@/components/ui/textarea"
import { ICampaign } from "@/shared/interfaces/models/campaign.interface"
import { ColumnDef } from "@tanstack/table-core"

export const campaignColumns: ColumnDef<ICampaign>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p>{row.original.name || "-"}</p>
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
