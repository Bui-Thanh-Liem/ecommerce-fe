import { ProductStatus } from "@/shared/enums/product-status.enum"
import z from "zod"
import { CreateProductImageSchema } from "./product-image.dto"

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(255, "Name must be at most 255 characters."),

  category: z.uuidv4(),

  brand: z.uuidv4(),

  desc: z.string().optional(),

  basePrice: z.number().min(0, "Base price must be at least 0."),

  status: z.enum(ProductStatus),

  productImages: z.array(CreateProductImageSchema),
})

export const UpdateProductSchema = CreateProductSchema.partial()

export type CreateProductDto = z.infer<typeof CreateProductSchema>
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>
