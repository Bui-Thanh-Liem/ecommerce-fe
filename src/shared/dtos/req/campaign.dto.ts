import z from "zod"
import { imageDtoSchema } from "../common/image.dto"

export const CreateCampaignSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),

  desc: z
    .string()
    .min(1, "Description is required.")
    .max(200, "Description must be at most 200 characters."),

  isActive: z.boolean().optional(),

  mainImage: imageDtoSchema.optional(),

  images: z.array(imageDtoSchema).max(5).optional(),

  startDate: z
    .date()
    .optional()
    .default(() => new Date()),

  endDate: z
    .date()
    .optional()
    .default(() => {
      const date = new Date()
      date.setDate(date.getDate() + 7) // Mặc định kết thúc sau 7 ngày
      return date
    }),

  promotions: z.array(z.uuidv4()).optional(),
})

export const UpdateCampaignSchema = CreateCampaignSchema.partial()

export type CreateCampaignDto = z.infer<typeof CreateCampaignSchema>
export type UpdateCampaignDto = z.infer<typeof UpdateCampaignSchema>
