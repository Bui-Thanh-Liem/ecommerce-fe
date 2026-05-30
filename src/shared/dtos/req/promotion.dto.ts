import z from "zod"
import { imageDtoSchema } from "../common/image.dto"
import { PromotionApplyType } from "@/shared/enums/promotion-apply-type.enum"
import { PromotionApplyScope } from "@/shared/enums/promotion-apply-scope.enum"

export const CreatePromotionSchema = z.object({
  campaign: z.uuidv4(),

  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be at most 50 characters."),

  image: imageDtoSchema.optional(),

  isActive: z.boolean().optional(),

  applyType: z.enum(PromotionApplyType),

  applyScope: z.enum(PromotionApplyScope),

  discountPercentage: z.number().min(0).max(100),

  productHighlighted: z.array(z.uuidv4()).optional(),

  limitQuantity: z.number().min(0),

  stores: z.array(z.uuidv4()).max(5).optional(),

  locations: z.array(z.uuidv4()).max(5).optional(),

  productPromotions: z.array(z.uuidv4()).max(5).optional(),

  categoryPromotions: z.array(z.uuidv4()).max(5).optional(),
})

export const UpdatePromotionSchema = CreatePromotionSchema.partial()

export type CreatePromotionDto = z.infer<typeof CreatePromotionSchema>
export type UpdatePromotionDto = z.infer<typeof UpdatePromotionSchema>
