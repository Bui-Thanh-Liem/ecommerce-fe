import z from "zod"
import { imageDtoSchema } from "../common/image.dto"

export const CreateTopBannerSchema = z.object({
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

export const UpdateTopBannerSchema = CreateTopBannerSchema.partial()

export type CreateTopBannerDto = z.infer<typeof CreateTopBannerSchema>
export type UpdateTopBannerDto = z.infer<typeof UpdateTopBannerSchema>
