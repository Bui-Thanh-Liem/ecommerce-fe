import { ProductVariantCondition } from "@/shared/enums/product-variant-condition.enum"
import { IBase } from "../../common/base.interface"
import { IProduct } from "./product.interface"
import { IProductItem } from "./product-item.interface"
import { IRating } from "../customer/rating.interface"
import { IPromotion } from "../mkt-program/promotion.interface"
import { IProductImage } from "./product-image.interface"
import { IInventory } from "../inventory/inventory.interface"
import { IProductPromotion } from "../mkt-program/product-promotion.interface"
import { ICartItem } from "../customer/cart-item.interface"

/**
 * KHÔNG DÙNG BẢNG ATTRIBUTE TRUYỀN THỐNG:
 * - Sẽ trùng khi ip15 128GB và ip16 128GB tốn kém disk
 * - Nhưng Sử dụng postgres (JSONB) thì các thuật toán nén đã tối ưu rất tốt
 * - Đổi lại thì sẽ đơn giản code hơn, trong khi vẫn đảm bảo hiệu năng tốt (không join nhiều, vẫn có index)
 **/
export interface IVariantAttribute {
  key: string // vd: "color", "storage"
  label: string // vd: "Màu sắc", "Dung lượng"
  value: string // vd: "Đen lục bảo", "128GB"
  isSKU: boolean // Thuộc tính nào sẽ hiển thị ở SKU, vd: màu sắc thì sẽ hiển thị ở SKU, còn tên sản phẩm thì không cần thiết
}

export interface IProductVariant extends IBase {
  product: IProduct
  sku: string
  slug: string
  barcode: string
  price: number
  costPrice: number
  discountPercent: number
  vat?: number // Thuế VAT (nếu có) được tính trên giá gốc (price), không tính trên giá đã giảm (discountPrice) %
  soldCount: number
  conditions: ProductVariantCondition
  salesAttributes: IVariantAttribute[]
  productImages: IProductImage[]

  //
  inventories?: IInventory[]
  productItems?: IProductItem[]
  rating?: IRating[]
  productPromotions?: IProductPromotion[]
  promotions?: IPromotion[]
  cartItems?: ICartItem[]
}
