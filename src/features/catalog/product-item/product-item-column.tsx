import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { IProductItem } from "@/shared/interfaces/models/product-item.interface"
import { ColumnDef } from "@tanstack/table-core"

export const productItemColumns: ColumnDef<IProductItem>[] = [
  {
    accessorKey: "inventory",
    header: "Inventory information",
    cell: ({ row }) => {
      const store = row.original.inventory.store
      return (
        <div className="space-y-1">
          <p>
            <span className="text-muted-foreground font-medium">Name: </span>
            {store.name}
          </p>
          <p className="line-clamp-4 max-w-96 whitespace-normal">
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
    accessorKey: "serialNumber",
    header: "Serial Number",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.serialNumber}</Badge>
    ),
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
    cell: ({ row }) => <span>${row.original.purchasePrice}</span>,
  },
  {
    accessorKey: "locationInWarehouse",
    header: "Location in Warehouse",
    cell: ({ row }) => {
      const location = row.original.locationInWarehouse

      return location ? (
        <Textarea value={row.original.locationInWarehouse} readOnly />
      ) : (
        <span>-</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
]
