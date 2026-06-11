import z from "zod"
import { CustomerProductType } from "@/shared/enums/customer-product-type.enum"

export const CreateCustomerProductSchema = z.object({
  productVariant: z.uuidv4().min(1, "Product variant is required."),

  type: z.enum(CustomerProductType),
})

export type CreateCustomerProductDto = z.infer<
  typeof CreateCustomerProductSchema
>
