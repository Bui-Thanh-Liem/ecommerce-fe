import { ProductImages } from "@/components/cell-in-table/product-images"
import { RenderBlog } from "@/components/cell-in-table/render-blog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  IProduct,
  ISpecification,
} from "@/shared/interfaces/models/product.interface"
import { randomColorByString } from "@/utils/random-color-by-string.util"
import { ColumnDef } from "@tanstack/table-core"
import { ChevronDownIcon } from "lucide-react"

export const productColumns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "productImages",
    header: "Product Images",
    cell: ({ row }) => {
      const images = row.original.productImages || []

      if (images.length <= 0) return <span>-</span>
      return <ProductImages images={images} />
    },
  },
  {
    accessorKey: "name",
    header: "Information",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p>Name: {row.original.name}</p>
        <p>
          SPU: <Badge>{row.original.spu}</Badge>
        </p>
        <p>
          Category:{" "}
          <Badge
            variant="secondary"
            className={randomColorByString(row.original.category.name)}
          >
            {row.original.category.name}
          </Badge>
        </p>
        <p>
          Brand:{" "}
          <Badge
            variant="secondary"
            className={randomColorByString(row.original.brand.name)}
          >
            {row.original.brand.name}
          </Badge>
        </p>
      </div>
    ),
  },
  {
    accessorKey: "specifications",
    header: "Specifications",
    cell: ({ row }) => {
      const specifications = row.original.specifications || []
      if (specifications.length <= 0) return <span>-</span>
      return <SpecificationsCell specifications={specifications} />
    },
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      return <RenderBlog content={row.original.desc} />
    },
  },
  {
    accessorKey: "basePrice",
    header: "Base Price",
    cell: ({ row }) => <p>${row.original.basePrice.toFixed(2)}</p>,
  },
  {
    accessorKey: "discountPercent",
    header: "Discount",
    cell: ({ row }) => <p>{row.original.discountPercent}%</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
]

function SpecificationsCell({
  specifications,
}: {
  specifications: ISpecification[]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Sửa lại Trigger thành asChild để tránh lỗi lồng thẻ button bừa bãi */}
        <Button variant="outline">View Specifications</Button>
      </DialogTrigger>

      <DialogContent className="w-full rounded-2xl p-6 sm:max-w-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-semibold">
            Specifications
          </DialogTitle>
        </DialogHeader>

        {/* Đặt chiều cao cố định và thanh cuộn mượt nếu danh sách quá dài */}
        <div className="scrollbar-thin max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {specifications.map((spec, idx) => (
            <Collapsible
              key={`${spec.title}-${idx}`}
              className="border-muted-foreground/10 bg-card/50 open:bg-muted/30 rounded-xl border shadow-sm transition-all duration-200"
              defaultOpen={idx === 0} // Tự động mở nhóm đầu tiên cho thân thiện
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="group hover:bg-muted/50 text-foreground flex w-full items-center justify-between rounded-xl px-4 py-5 text-sm font-semibold"
                >
                  <span>{spec.title}</span>
                  <ChevronDownIcon className="text-muted-foreground h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="px-4 pt-1 pb-4 transition-all">
                {/* Đổi thành layout dạng bảng sọc (zebra striping) để cực kỳ dễ tra cứu */}
                <div className="border-muted-foreground/5 bg-background overflow-hidden rounded-lg border">
                  {spec.items.map((item, itemIdx) => (
                    <div
                      key={`${item.key}-${itemIdx}`}
                      className="border-muted-foreground/5 odd:bg-muted/20 grid grid-cols-3 gap-4 border-b p-3 text-xs last:border-0"
                    >
                      {/* Cột Key chiếm 1 phần, chữ xám đậm */}
                      <span className="text-muted-foreground font-medium">
                        {item.key}
                      </span>
                      {/* Cột Value chiếm 2 phần, chữ đen rõ ràng hơn */}
                      <span className="text-foreground col-span-2 font-medium break-words">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
