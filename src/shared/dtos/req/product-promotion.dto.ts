import z from "zod"

export const CreateProductPromotionSchema = z.object({
  customDiscount: z
    .number()
    .min(0, "Custom discount must be at least 0.")
    .max(100, "Custom discount must be at most 100."),

  priority: z
    .number()
    .int("Priority must be an integer.")
    .min(0, "Priority must be at least 0.")
    .max(100, "Priority must be at most 100."),

  limitQuantity: z
    .number()
    .int("Limit quantity must be an integer.")
    .min(0, "Limit quantity must be at least 0."),

  productVariant: z.uuidv4(),

  promotion: z.uuidv4(),
})

export const UpdateProductPromotionSchema =
  CreateProductPromotionSchema.partial()

export type CreateProductPromotionDto = z.infer<
  typeof CreateProductPromotionSchema
>
export type UpdateProductPromotionDto = z.infer<
  typeof UpdateProductPromotionSchema
>
