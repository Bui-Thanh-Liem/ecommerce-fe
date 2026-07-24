import { PaymentMethod } from "@/shared/enums/payment-method.enum"
import z from "zod"

export const CreateCheckoutSchema = z.object({
  order: z.uuidv4("Order must be a valid UUID."),

  amount: z
    .number()
    .min(1000, "Số tiền tối thiểu là 1000 VND")
    .max(1000000000, "Số tiền tối đa là 1 tỷ VND"),

  description: z.string().min(1, "Description is required."),

  paymentMethod: z.enum(PaymentMethod),
})

export type CreateCheckoutDto = z.infer<typeof CreateCheckoutSchema>
