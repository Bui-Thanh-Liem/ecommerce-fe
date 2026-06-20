import { ProductImages } from "@/components/cell-in-table/product-images"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  IProductVariant,
  IVariantAttribute,
} from "@/shared/interfaces/models/catalog/product-variant.interface"
import { randomColorByString } from "@/utils/random-color-by-string.util"
import { ColumnDef } from "@tanstack/table-core"
import Barcode from "react-barcode"

export const productVariantColumns: ColumnDef<IProductVariant>[] = [
  {
    accessorKey: "product",
    header: "Product Information",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="line-clamp-4 max-w-72 whitespace-normal">
          <span className="text-muted-foreground font-medium">Name: </span>
          {row.original.product?.name}
        </p>
        <p>
          <span className="text-muted-foreground font-medium">SPU: </span>
          <Badge>{row.original.product?.spu}</Badge>
        </p>
      </div>
    ),
  },
  {
    accessorKey: "productItems",
    header: "Product variant information",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p>
          <span className="text-muted-foreground font-medium">SKU: </span>
          <Badge>{row.original.sku}</Badge>
        </p>
        <p>
          <span className="text-muted-foreground font-medium">
            Cost price:{" "}
          </span>
          {row.original.costPrice.toFixed(2)}
        </p>
        <p>
          <span className="text-muted-foreground font-medium">Price: </span>
          {row.original.price.toFixed(2)}
        </p>
        <p>
          <span className="text-muted-foreground font-medium">Discount: </span>
          {row.original.discountPercent}%
        </p>
        <p>
          <span className="text-muted-foreground font-medium">VAT: </span>
          {row.original.vat}%
        </p>
      </div>
    ),
  },
  {
    accessorKey: "salesAttributes",
    header: "Sales Attributes",
    cell: ({ row }) => {
      const salesAttributes = row.original.salesAttributes || []
      if (salesAttributes.length <= 0) return <span>-</span>
      return <SalesAttributesCell salesAttributes={salesAttributes} />
    },
  },
  {
    accessorKey: "productImages",
    header: "Product variant Images",
    cell: ({ row }) => {
      const images = row.original.productImages || []
      if (images.length <= 0) return <span>-</span>
      return <ProductImages images={images} />
    },
  },
  {
    accessorKey: "barcode",
    header: "Barcode",
    cell: ({ row }) => (
      <Barcode
        width={2}
        height={50}
        displayValue
        format="CODE128"
        value={row.original.barcode}
      />
    ),
  },
  {
    accessorKey: "conditions",
    header: "Conditions",
    cell: ({ row }) => <Badge>{row.original.conditions}</Badge>,
  },
]

function SalesAttributesCell({
  salesAttributes,
}: {
  salesAttributes: IVariantAttribute[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Sửa lại Trigger thành asChild để tránh lỗi lồng thẻ button bừa bãi */}
        <Button variant="outline">View</Button>
      </DialogTrigger>

      <DialogContent className="w-full rounded-2xl p-6 sm:max-w-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-semibold">
            Sales Attributes
          </DialogTitle>
        </DialogHeader>

        {/* Đặt chiều cao cố định và thanh cuộn mượt nếu danh sách quá dài */}
        <div className="max-h-[60vh] scrollbar-thin space-y-3 overflow-y-auto">
          {salesAttributes.map((attr, idx) => {
            const isSUKU = attr.isSKU
            return (
              <div key={`${attr.key}-${idx}`}>
                <span className="text-muted-foreground font-medium">
                  {attr.label}
                </span>
                <span className="text-foreground col-span-2 font-medium wrap-break-word">
                  : {attr.value}
                </span>
                {isSUKU && (
                  <Badge
                    className={cn(
                      "ml-6",
                      randomColorByString(attr.isSKU.toString())
                    )}
                  >
                    {attr.isSKU ? "Yes" : "No"}
                  </Badge>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
