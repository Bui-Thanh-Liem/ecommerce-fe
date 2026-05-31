import { Active } from "@/components/active"
import { ImagesCell } from "@/components/cell-in-table/images"
import { Badge } from "@/components/ui/badge"
import { useUpdatePromotion } from "@/hooks/apis/use-promotion"
import { IPromotion } from "@/shared/interfaces/models/promotion.interface"
import { ColumnDef, Row } from "@tanstack/table-core"

//
const StatusCell = ({ row }: { row: Row<IPromotion> }) => {
  const { mutate } = useUpdatePromotion()

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

export const promotionColumns: ColumnDef<IPromotion>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image
      return <ImagesCell images={[image]} />
    },
  },
  {
    accessorKey: "campaign",
    header: "Campaign",
    cell: ({ row }) => {
      return (
        <p className="max-w-60 overflow-auto whitespace-normal">
          {row.original.campaign?.name || "-"}
        </p>
      )
    },
  },
  {
    accessorKey: "productHighlighted",
    header: "Product Highlighted",
    cell: ({ row }) => {
      const pvs = row.original.productHighlighted || []
      if (pvs.length <= 0) return <span>-</span>
      return (
        <div className="space-y-1">
          {pvs.map((pv) => (
            <Badge key={pv.id}>{pv.sku}</Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <p className="max-w-60 overflow-auto whitespace-normal">
          {row.original.name || "-"}
        </p>
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
    accessorKey: "applyScope",
    header: "Apply Scope",
    cell: ({ row }) => {
      return <Badge>{row.original.applyScope || "-"}</Badge>
    },
  },
  {
    accessorKey: "applyType",
    header: "Apply Type",
    cell: ({ row }) => {
      return <Badge>{row.original.applyType || "-"}</Badge>
    },
  },
  {
    accessorKey: "limitQuantity",
    header: "Limit Quantity",
    cell: ({ row }) => {
      return <p>{row.original.limitQuantity || 0}</p>
    },
  },
  {
    accessorKey: "totalSoldQuantity",
    header: "Total Sold Quantity",
    cell: ({ row }) => {
      return <p>{row.original.totalSoldQuantity || 0}</p>
    },
  },
  {
    accessorKey: "stores",
    header: "Stores",
    cell: ({ row }) => {
      return (
        <div className="max-w-60 overflow-auto whitespace-normal">
          {row.original.stores?.map((s) => (
            <p key={s.id}>{s.name}</p>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "locations",
    header: "Locations",
    cell: ({ row }) => {
      return (
        <div className="max-w-60 overflow-auto whitespace-normal">
          {row.original.locations?.map((l) => (
            <p key={l.id}>{l.name}</p>
          ))}
        </div>
      )
    },
  },
]
