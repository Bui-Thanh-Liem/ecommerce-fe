import { Active } from "@/components/active"
import { ImagesCell } from "@/components/cell-in-table/images"
import { MktProgramCell } from "@/components/cell-in-table/mkt-program-cell"
import { RangeCell } from "@/components/cell-in-table/range-cell"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUpdateCampaign } from "@/hooks/apis/mkt-program/use-campaign"
import { ICampaign } from "@/shared/interfaces/models/mkt-program/campaign.interface"
import { ColumnDef, Row } from "@tanstack/table-core"
import Link from "next/link"

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
    accessorKey: "marketingProgram",
    header: "Marketing Program",
    cell: ({ row }) => {
      const marketingProgram = row.original.marketingProgram
      if (!marketingProgram) return <span>-</span>
      return <MktProgramCell mktProgram={marketingProgram} />
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const { startDate, endDate, name } = row.original

      return (
        <>
          <p className="max-w-60 overflow-auto whitespace-normal">
            {name || "-"}
          </p>
          <RangeCell startDate={startDate} endDate={endDate} />
        </>
      )
    },
  },
  {
    accessorKey: "mainImage",
    header: "Main Image",
    cell: ({ row }) => {
      const mainImage = row.original.mainImage
      if (!mainImage) return <span>-</span>
      return <ImagesCell images={[mainImage]} />
    },
  },
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const images = row.original.images || []
      if (images.length <= 0) return <span>-</span>
      return <ImagesCell images={images} />
    },
  },
  {
    accessorKey: "productHighlighted",
    header: "Product Highlighted",
    cell: ({ row }) => {
      const productHighlighted = row.original.productHighlighted || []
      if (!productHighlighted.length) return <span>-</span>
      return (
        <div className="space-y-1">
          {productHighlighted.map((p) => (
            <Tooltip key={p.id}>
              <TooltipTrigger asChild className="block">
                <Badge className="cursor-help">{p.sku}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{p.product.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
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
    accessorKey: "promotions",
    header: "Promotions",
    cell: ({ row }) => {
      const promotions = row.original.promotions
      if (!promotions?.length) return <p>-</p>
      return (
        <>
          {promotions.map((c) => (
            <Link
              key={c.id}
              href={`/marketing-programs/promotions/?id=${c.id}`}
              className="hover:underline"
            >
              <p className="max-w-60 overflow-auto whitespace-normal">
                {c.name}
              </p>
            </Link>
          ))}
        </>
      )
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
