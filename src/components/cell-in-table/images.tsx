import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IImage } from "@/shared/interfaces/common/image.interface"

export function ImagesCell({ images }: { images: IImage[] }) {
  return (
    <div className="flex -space-x-8">
      {images?.map((img) => (
        <div
          key={img.key}
          className="cursor-pointer transition-all duration-200 hover:z-10 hover:-translate-y-1"
        >
          <Avatar className="size-14">
            <AvatarImage
              src={img.url}
              alt={`Product Image ${img.key}`}
              className="rounded"
            />
            <AvatarFallback className="rounded">
              {img.url ? img.url[0].toUpperCase() : "-"}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  )
}
