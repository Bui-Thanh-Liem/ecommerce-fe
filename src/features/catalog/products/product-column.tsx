import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"
import { IProductImage } from "@/shared/interfaces/models/product-image.interface"
import { IProduct } from "@/shared/interfaces/models/product.interface"
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
          <Badge variant="secondary">{row.original.category.name}</Badge>
        </p>
        <p>
          Brand: <Badge variant="secondary">{row.original.brand.name}</Badge>
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
      return (
        <div className="min-w-64 space-y-1">
          {specifications.map((spec, idx) => (
            <Collapsible
              key={`${spec.items}-${idx}`}
              className="data-[state=open]:bg-muted rounded-md"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="group w-full">
                  {spec.title}
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
                {spec.items.map((item, itemIdx) => (
                  <div
                    key={`${item.key}-${itemIdx}`}
                    className="flex items-center gap-2 pl-1"
                  >
                    <span className="font-medium">{item.key}:</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )
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
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      return <Textarea value={row.original.desc} readOnly />
    },
  },
]

export function ProductImages({ images }: { images: IProductImage[] }) {
  return (
    <div className="flex -space-x-8">
      {images?.map((img) => (
        <div
          key={img.id}
          className="cursor-pointer transition-all duration-200 hover:z-10 hover:-translate-y-1"
        >
          <Avatar className="size-14">
            <AvatarImage
              src={img.image.url}
              alt={`Product Image ${img.id}`}
              className="rounded"
            />
            <AvatarFallback className="rounded">
              {img.image.url ? img.image.url[0].toUpperCase() : "-"}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  )
}
