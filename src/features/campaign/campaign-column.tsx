import { Active } from "@/components/active"
import { Images } from "@/components/cell-in-table/images"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateCampaign } from "@/hooks/apis/use-campaign"
import { ICampaign } from "@/shared/interfaces/models/campaign.interface"
import { ColumnDef, Row } from "@tanstack/table-core"
import { format } from "date-fns"

//
const StatusCell = ({ row }: { row: Row<ICampaign> }) => {
  const { mutate } = useUpdateCampaign()

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

export const campaignColumns: ColumnDef<ICampaign>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <p>{row.original.name || "-"}</p>
    },
  },
  {
    accessorKey: "mainImage",
    header: "Main Image",
    cell: ({ row }) => {
      const mainImage = row.original.mainImage
      if (!mainImage) return <span>-</span>
      return <Images images={[mainImage]} />
    },
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const images = row.original.images || []
      if (images.length <= 0) return <span>-</span>
      return <Images images={images} />
    },
  },
  {
    accessorKey: "startDate",
    header: "Date range",
    cell: ({ row }) => {
      const { startDate, endDate } = row.original

      if (!startDate || !endDate) {
        return <span>-</span>
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      return (
        <div className="space-y-1 text-sm leading-5">
          <p>
            {format(start, "MMM do, yyyy")} {format(start, "hh:mm:ss a")}
          </p>

          <p className="text-muted-foreground">
            {format(end, "MMM do, yyyy")} {format(end, "hh:mm:ss a")}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => <StatusCell row={row} />,
    enableHiding: false,
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
