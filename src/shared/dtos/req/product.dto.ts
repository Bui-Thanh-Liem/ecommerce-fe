import { ProductStatus } from "@/shared/enums/product-status.enum"
import z from "zod"
import { CreateProductImageSchema } from "./product-image.dto"

export const SpecificationItemSchema = z.object({
  key: z.string().trim().min(1, "Key is required."),

  label: z.string().trim().min(1, "Label is required."),

  value: z.string().trim().min(1, "Value is required."),

  desc: z.string().trim().optional(),

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

  secondaryCategories: z.array(z.uuidv4()).optional(),

  brand: z.uuidv4().min(1, "Brand is required."),

  desc: z.string().optional(),

  model: z.string().max(20, "Model must be at most 20 characters."),

  basePrice: z.number().min(0, "Base price must be at least 0."),

  discountPercent: z.number().min(0).max(100).optional().default(0),

  status: z.enum(ProductStatus),

  isFeatured: z.boolean().optional().default(false),

  allowReview: z.boolean().optional().default(true),

  weight: z.number().min(0).optional().default(0),

  height: z.number().min(0).optional().default(0),

  length: z.number().min(0).optional().default(0),

  width: z.number().min(0).optional().default(0),

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
