import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { IProduct } from "@/shared/interfaces/models/product.interface"
import { ColumnDef } from "@tanstack/table-core"
import Image from "next/image"

export const productColumns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "productImages",
    header: "Product Images",
    cell: ({ row }) => {
      const images = row.original.productImages || []
      if (images.length > 0) return <span>-</span>

      return (
        <div className="flex space-x-2">
          {images.map((img) => (
            <Image
              key={img.id}
              src={img.url}
              width={60}
              height={60}
              alt={`Product Image ${img.id}`}
              className="rounded object-cover"
            />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <p>{row.original.name}</p>,
    enableHiding: false,
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      return <Textarea>{row.original.desc}</Textarea>
    },
  },
  {
    accessorKey: "spu",
    header: "SPU",
    cell: ({ row }) => {
      return <Badge>{row.original.spu}</Badge>
    },
  },
  {
    accessorKey: "basePrice",
    header: "Base Price",
    cell: ({ row }) => <p>${row.original.basePrice.toFixed(2)}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge>{row.original.status}</Badge>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <p>{row.original.category.name || "-"}</p>,
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => <p>{row.original.brand.name || "-"}</p>,
  },
]
