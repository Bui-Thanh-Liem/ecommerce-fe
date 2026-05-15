import z from "zod"

export const CreateBrandSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
  logoUrl: z.string(),
  country: z
    .string()
    .min(1, "Country is required.")
    .max(100, "Country must be at most 100 characters."),
})

export const UpdateBrandSchema = CreateBrandSchema.partial()

export type CreateBrandDto = z.infer<typeof CreateBrandSchema>
export type UpdateBrandDto = z.infer<typeof UpdateBrandSchema>
