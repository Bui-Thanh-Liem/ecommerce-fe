import z from "zod"

export const CreateCategoryPromotionSchema = z.object({
  customDiscount: z
    .number()
    .min(0, "Custom discount must be at least 0.")
    .max(100, "Custom discount must be at most 100."),

  priority: z
    .number()
    .int("Priority must be an integer.")
    .min(0, "Priority must be at least 0.")
    .max(100, "Priority must be at most 100."),

  category: z.uuidv4(),

  promotion: z.uuidv4(),
})

export const UpdateCategoryPromotionSchema =
  CreateCategoryPromotionSchema.partial()

export type CreateCategoryPromotionDto = z.infer<
  typeof CreateCategoryPromotionSchema
>
export type UpdateCategoryPromotionDto = z.infer<
  typeof UpdateCategoryPromotionSchema
>
