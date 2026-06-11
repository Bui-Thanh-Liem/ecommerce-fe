import { Badge } from "@/components/ui/badge"
import { IProductPromotion } from "@/shared/interfaces/models/product-promotion.interface"
import { ColumnDef } from "@tanstack/table-core"

export const productPromotionColumns: ColumnDef<IProductPromotion>[] = [
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
    accessorKey: "productVariant",
    header: "Product Variant",
    cell: ({ row }) => {
      const product = row.original.productVariant.product
      const productVariant = row.original.productVariant
      const salesAttributes = productVariant.salesAttributes
      return (
        <div className="space-y-1">
          <p className="line-clamp-4 max-w-96 whitespace-normal">
            <span className="text-muted-foreground font-medium">SKU: </span>
            <Badge> {productVariant.sku}</Badge>
          </p>

          <p className="line-clamp-4 max-w-96 whitespace-normal">
            <span className="text-muted-foreground font-medium">Name: </span>
            {product?.name}
          </p>

          <div>
            {salesAttributes?.map((attr) => (
              <p key={attr.key}>
                <span className="text-muted-foreground font-medium">
                  {attr.label}:{" "}
                </span>
                {attr.value}
              </p>
            ))}
          </div>
        </div>
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
  {
    accessorKey: "limitQuantity",
    header: "Limit Quantity",
    cell: ({ row }) => {
      return <p>{row.original.limitQuantity || "-"}</p>
    },
  },
]
