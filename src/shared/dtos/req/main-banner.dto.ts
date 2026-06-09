import z from "zod"
import { imageDtoSchema } from "../common/image.dto"

export const CreateMainBannerSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title must be at most 100 characters."),
  desc: z
    .string()
    .min(1, "Description is required.")
    .max(200, "Description must be at most 200 characters."),
  image: imageDtoSchema.optional(),

  isActive: z.boolean().optional(),
})

export const UpdateMainBannerSchema = CreateMainBannerSchema.partial()

export type CreateMainBannerDto = z.infer<typeof CreateMainBannerSchema>
export type UpdateMainBannerDto = z.infer<typeof UpdateMainBannerSchema>
