import { ProductImages } from "@/components/cell-in-table/product-images"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IInventory } from "@/shared/interfaces/models/inventory.interface"
import { randomColorByString } from "@/utils/random-color-by-string.util"
import { ColumnDef } from "@tanstack/table-core"

export const inventoryColumns: ColumnDef<IInventory>[] = [
  {
    accessorKey: "store",
    header: "Store/Warehouse",
    cell: ({ row }) => {
      const store = row.original.store
      return (
        <div className="space-y-1">
          <p>
            <span className="text-muted-foreground font-medium">Name: </span>
            {store.name}
          </p>
          <p className="line-clamp-4 max-w-72 whitespace-normal">
            <span className="text-muted-foreground font-medium">Address: </span>
            {store.address}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: "productVariant",
    header: "Product variant",
    cell: ({ row }) => {
      const product = row.original.productVariant.product
      const salesAttributes = row.original.productVariant.salesAttributes
      return (
        <div className="space-y-1">
          <p className="line-clamp-4 max-w-72 whitespace-normal">
            <span className="text-muted-foreground font-medium">Name: </span>
            {product.name}
          </p>
          <div>
            {salesAttributes.map((attr) => (
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
    accessorKey: "productImages",
    header: "Product variant Images",
    cell: ({ row }) => {
      const images = row.original.productVariant.productImages || []
      if (images.length <= 0) return <span>-</span>
      return <ProductImages images={images} />
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <span>{row.original.quantity}</span>,
  },
  {
    accessorKey: "minStockLevel",
    header: "Minimum Stock Level",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <p>{row.original.minStockLevel}</p>
        </TooltipTrigger>
        <TooltipContent>
          A notification will be sent to the warehouse manager and store manager
          when the quantity reaches this level.
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "stockType",
    header: "Stock Type",
    cell: ({ row }) => (
      <Badge className={randomColorByString(row.original.stockType)}>
        {row.original.stockType}
      </Badge>
    ),
  },
]
