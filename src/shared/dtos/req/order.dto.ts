import { PaymentGateway } from "@/shared/enums/order-payment-gateway.enum"
import { PaymentMethod } from "@/shared/enums/payment-method.enum"
import z from "zod"

const OrderItemSchema = z.object({
  product: z.uuidv4("Product must be a valid UUID."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
  price: z.number().min(0, "Price must be a positive number."),
})

export const CreateOrderSchema = z.object({
  orderItems: z
    .array(OrderItemSchema)
    .min(1, "At least one order item is required."),

  totalAmount: z.number().min(0, "Total amount must be a positive number."),

  paymentGateway: z.enum(PaymentGateway),

  paymentMethod: z.enum(PaymentMethod),

  shoppingAddress: z
    .string()
    .min(1, "Shopping address is required.")
    .max(200, "Shopping address must be at most 200 characters."),

  recipientName: z
    .string()
    .min(1, "Recipient name is required.")
    .max(50, "Recipient name must be at most 50 characters."),

  recipientPhone: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\+?[0-9]{7,15}$/, "Phone number must be valid")
    .max(20, "Phone number must be at most 20 characters."),
})

export const ChangeQuantityItemOrderSchema = z.object({
  orderId: z.uuid("Order ID must be a valid UUID."),
  orderItemId: z.uuid("Order Item ID must be a valid UUID."),
  productId: z.uuid("Product ID must be a valid UUID."),
  quantity: z.number().min(1, "Quantity must be at least 1."),
})

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>
export type ChangeQuantityItemOrderDto = z.infer<
  typeof ChangeQuantityItemOrderSchema
>
