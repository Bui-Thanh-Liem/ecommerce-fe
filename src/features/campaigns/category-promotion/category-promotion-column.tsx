import { ICategoryPromotion } from "@/shared/interfaces/models/category-promotion.interface"
import { ColumnDef } from "@tanstack/table-core"

export const categoryPromotionColumns: ColumnDef<ICategoryPromotion>[] = [
  {
    accessorKey: "promotion",
    header: "Promotion",
    cell: ({ row }) => {
      return (
        <p className="max-w-60 overflow-auto whitespace-normal">
          {row.original.promotion.name || "-"}
        </p>
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <p className="max-w-60 overflow-auto whitespace-normal">
          {row.original.category.name || "-"}
        </p>
      )
    },
  },
  {
    accessorKey: "customDiscount",
    header: "Custom Discount",
    cell: ({ row }) => {
      return <p>{row.original.customDiscount || "-"}</p>
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      return <p>{row.original.priority || "-"}</p>
    },
  },
]
