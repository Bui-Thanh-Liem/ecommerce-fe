import { ImagesCell } from "@/components/cell-in-table/images"
import { IPromotion } from "@/shared/interfaces/models/promotion.interface"
import { ColumnDef } from "@tanstack/table-core"

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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.original.image
      return <ImagesCell images={[image]} />
    },
  },
]
