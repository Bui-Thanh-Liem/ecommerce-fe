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
import {
  IProductVariant,
  IVariantAttribute,
} from "@/shared/interfaces/models/product-variant.interface"
import { ColumnDef } from "@tanstack/table-core"

export const productVariantColumns: ColumnDef<IProductVariant>[] = [
  {
    accessorKey: "product",
    header: "Product Information",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p>Name: {row.original.product?.name}</p>
        <p>
          SPU: <Badge>{row.original.product?.spu}</Badge>
        </p>
        <p>
          SKU: <Badge>{row.original.sku}</Badge>
        </p>
      </div>
    ),
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
    accessorKey: "salesAttributes",
    header: "Sales Attributes",
    cell: ({ row }) => {
      const salesAttributes = row.original.salesAttributes || []
      if (salesAttributes.length <= 0) return <span>-</span>
      return <SalesAttributesCell salesAttributes={salesAttributes} />
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <p>${row.original.price.toFixed(2)}</p>,
  },
  {
    accessorKey: "discountPercent",
    header: "Discount",
    cell: ({ row }) => <p>{row.original.discountPercent}%</p>,
  },
  {
    accessorKey: "vat",
    header: "VAT",
    cell: ({ row }) => <p>{row.original.vat}%</p>,
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
        <Button variant="outline">View Sales Attributes</Button>
      </DialogTrigger>

      <DialogContent className="w-full rounded-2xl p-6 sm:max-w-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-semibold">
            Sales Attributes
          </DialogTitle>
        </DialogHeader>

        {/* Đặt chiều cao cố định và thanh cuộn mượt nếu danh sách quá dài */}
        <div className="scrollbar-thin max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {salesAttributes.map((attr, idx) => (
            <div key={`${attr.key}-${idx}`}>
              <span className="font-medium">{attr.key}</span>
              <span>: {attr.value}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
