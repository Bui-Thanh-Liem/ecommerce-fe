import { ProductVariantCondition } from "@/shared/enums/product-variant-condition.enum"
import { ProductVariantStatus } from "@/shared/enums/product-variant-status.enum"

export function convertEnumToVN(status: string) {
  const statusMap: Record<string, string> = {
    [ProductVariantStatus.NEW]: "Mới",
    [ProductVariantStatus.DRAFT]: "Bản nháp",
    [ProductVariantStatus.NORMAL]: "Bình thường",
    [ProductVariantStatus.OUT_OF_STOCK]: "Hết hàng",
    [ProductVariantStatus.STANDOUT]: "Nổi bật",
    [ProductVariantStatus.DISCONTINUED]: "Ngừng kinh doanh",
    [ProductVariantCondition.RETURNED]: "Hàng đổi trả",
    [ProductVariantCondition.DISPLAY]: "Hàng trưng bày",
  }
  return statusMap[status] || status
}
