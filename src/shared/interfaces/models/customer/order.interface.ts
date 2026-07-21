import { OrderStatus } from "@/shared/enums/order-status.enum"
import { PaymentMethod } from "@/shared/enums/payment-method.enum"
import { IBase } from "../../common/base.interface"
import { ICustomer } from "./customer.interface"
import { PaymentGateway } from "@/shared/enums/order-payment-gateway.enum"
import { IOrderItem } from "./order-item.interface"

export interface IOrder extends IBase {
  customer: ICustomer
  totalAmount: number
  status: OrderStatus
  invoiceNumber: string
  shoppingAddress: string
  recipientName: string
  recipientPhone: string
  paymentGateway: PaymentGateway
  paymentMethod: PaymentMethod

  //
  orderItems: IOrderItem[]
}
