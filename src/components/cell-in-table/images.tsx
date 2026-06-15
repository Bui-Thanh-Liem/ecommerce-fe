import Image from "next/image"
import { useState } from "react"
import { IImage } from "@/shared/interfaces/common/image.interface"

export function ImagesCell({ images }: { images: IImage[] }) {
  return (
    <div className="flex -space-x-8">
      {images?.map((img) => (
        <ImageItem key={img.key} img={img} />
      ))}
    </div>
  )
}

// Tách thành một Component nhỏ để quản lý trạng thái lỗi (error state) của từng ảnh độc lập
function ImageItem({ img }: { img: IImage }) {
  const [isError, setIsError] = useState(false)

  // Ký tự đại diện khi không có ảnh
  const fallbackChar = img.url ? img.url[0].toUpperCase() : "-"

  return (
    <div className="group relative cursor-pointer transition-all duration-200 hover:z-10 hover:-translate-y-1">
      {img.url && !isError ? (
        <div className="relative size-14 overflow-hidden">
          <Image
            fill
            src={img.url}
            sizes="56px" // Định kích thước chính xác cho Next.js tối ưu (size-14 = 56px)
            className="object-contain"
            alt={`Product Image ${img.key}`}
            onError={() => setIsError(true)} // Nếu lỗi, chuyển sang trạng thái hiển thị Fallback
          />
        </div>
      ) : (
        /* Fallback hiển thị chữ cái đầu khi không có url hoặc ảnh bị lỗi tải */
        <div className="bg-muted text-muted-foreground border-background flex size-14 items-center justify-center rounded border-2 text-sm font-medium shadow-sm">
          {fallbackChar}
        </div>
      )}
    </div>
  )
}
