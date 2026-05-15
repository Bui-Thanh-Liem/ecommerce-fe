import z from "zod"

export const CreateProductImageSchema = z.object({
  url: z.url("Invalid URL format."),
})

export const UpdateProductImageSchema = CreateProductImageSchema.partial()

export type CreateProductImageDto = z.infer<typeof CreateProductImageSchema>
export type UpdateProductImageDto = z.infer<typeof UpdateProductImageSchema>
