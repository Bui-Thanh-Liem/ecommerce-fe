import { IBase } from "../common/base.interface"
import { IProductVariant } from "./product-variant.interface"
import { IProduct } from "./product.interface"

export interface IProductImage extends IBase {
  url: string
  product: IProduct
  sortOrder: number
  isThumbnail: boolean
  productVariant?: IProductVariant | null
}
