import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IProductImage } from "@/shared/interfaces/models/product-image.interface"

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
