import { Active } from "@/components/active"
import { ImagesCell } from "@/components/cell-in-table/images"
import { Badge } from "@/components/ui/badge"
import { useUpdatePromotion } from "@/hooks/apis/use-promotion"
import { PromotionApplyScope } from "@/shared/enums/promotion-apply-scope.enum"
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image
      return <ImagesCell images={[image]} />
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
    accessorKey: "applyScope",
    header: "Apply Scope",
    cell: ({ row }) => {
      const promotion = row.original

      return (
        <div className="space-y-1">
          <Badge>{promotion.applyScope || "-"}</Badge>
          {promotion.applyScope === PromotionApplyScope.REGIONS && (
            <>
              {promotion.locations?.map((l) => (
                <p key={l.id}>
                  {l.type}: {l.name}
                </p>
              ))}
            </>
          )}
          {promotion.applyScope === PromotionApplyScope.SPECIFIC_STORES && (
            <>
              {promotion.stores?.map((s) => (
                <p key={s.id}>store: {s.name}</p>
              ))}
            </>
          )}
        </div>
      )
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
    header: "Quantity",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <p>Limit: {row.original.limitQuantity || 0}</p>
          <p>Sold: {row.original.totalSoldQuantity || 0}</p>
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
]
