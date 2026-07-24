import { PaymentMethod } from "@/shared/enums/payment-method.enum"

export interface IResponseCheckout {
  checkoutURL: string
  checkoutFormFields: {
    signature: string
    merchant?: string
    operation?: "PURCHASE"
    payment_method?: PaymentMethod
    order_invoice_number: string
    order_amount: number
    currency: string
    order_description: string
    order_tax_amount?: number
    customer_id?: string
    success_url?: string
    error_url?: string
    cancel_url?: string
    custom_data?: string
  }
}
