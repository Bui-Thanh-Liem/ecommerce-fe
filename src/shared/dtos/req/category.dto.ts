import z from "zod"
import { imageDtoSchema } from "../common/image.dto"

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be at most 50 characters."),

  image: imageDtoSchema.nullable().optional(),

  imageInPage: imageDtoSchema.nullable().optional(),

  desc: z
    .string()
    .min(1, "Description is required.")
    .max(200, "Description must be at most 200 characters."),

  parent: z.uuidv4().optional(),

  minPrice: z.number().optional(),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>
