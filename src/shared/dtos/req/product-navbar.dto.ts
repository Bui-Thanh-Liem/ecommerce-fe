import z from "zod"

export const CreateProductNavbarSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be at most 50 characters."),

  desc: z.string().max(100, "Description must be at most 100 characters."),

  link: z
    .url("Invalid URL format.")
    .max(100, "Link must be at most 100 characters."),
})

export const UpdateProductNavbarSchema = CreateProductNavbarSchema.partial()

export type CreateProductNavbarDto = z.infer<typeof CreateProductNavbarSchema>
export type UpdateProductNavbarDto = z.infer<typeof UpdateProductNavbarSchema>
