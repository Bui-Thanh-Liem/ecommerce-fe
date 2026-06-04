import { IBase } from "../common/base.interface"
import { ICart } from "./cart.interface"
import { IRating } from "./rating.inetrface"

export interface ICustomer extends IBase {
  fullname: string
  phone: string
  email?: string
  isActive: boolean
  address: string[]

  // Quan hệ với các entity khác
  ratings?: IRating[]
  carts?: ICart[] // Một khách hàng có thể có nhiều giỏ hàng (nếu họ mua hàng nhiều lần)
}
