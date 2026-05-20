import { Provider } from "@/shared/enums/provider.enum"
import z from "zod"

export const CreateProductImageSchema = z.object({
  url: z.url("Invalid URL format."),
  key: z.string().optional(),
  provider: z.enum(Provider),
})

export const UpdateProductImageSchema = CreateProductImageSchema.partial()

export type CreateProductImageDto = z.infer<typeof CreateProductImageSchema>
export type UpdateProductImageDto = z.infer<typeof UpdateProductImageSchema>
