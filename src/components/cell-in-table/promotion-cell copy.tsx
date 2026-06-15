import { IPromotion } from "@/shared/interfaces/models/mkt-program/promotion.interface"
import Image from "next/image"

export function PromotionCell({ promotion }: { promotion: IPromotion }) {
  return (
    <>
      <Image
        width={40}
        height={40}
        alt={promotion.name}
        src={promotion.image?.url}
      />
      <p className="max-w-60 overflow-auto whitespace-normal">
        {promotion.name || "-"}
      </p>
    </>
  )
}
