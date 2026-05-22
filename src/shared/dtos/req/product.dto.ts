import { ProductStatus } from "@/shared/enums/product-status.enum"
import z from "zod"
import { CreateProductImageSchema } from "./product-image.dto"

export const SpecificationItemSchema = z.object({
  key: z.string().trim().min(1, "Key is required."),

  value: z.string().trim().min(1, "Value is required."),

  isHighlight: z.boolean().optional(),

  order: z
    .number({
      error: "Order must be a number.",
    })
    .min(0, "Order must be greater than or equal to 0."),
})

const SpecificationSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),

  items: z
    .array(SpecificationItemSchema)
    .min(1, "At least 1 specification item is required."),
})

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(255, "Name must be at most 255 characters."),

  category: z.uuidv4().min(1, "Category is required."),

  brand: z.uuidv4().min(1, "Brand is required."),

  desc: z.string().optional(),

  basePrice: z.number().min(0, "Base price must be at least 0."),

  discountPercent: z.number().min(0).max(100).optional().default(0),

  status: z.enum(ProductStatus),

  specifications: z
    .array(SpecificationSchema)
    .min(1, "At least 1 specification is required."),

  productImages: z
    .array(
      z.object({
        image: CreateProductImageSchema,
      })
    )
    .max(6, "You can upload up to 6 images."),
})

export const UpdateProductSchema = CreateProductSchema.partial()

export type CreateProductDto = z.infer<typeof CreateProductSchema>
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>
