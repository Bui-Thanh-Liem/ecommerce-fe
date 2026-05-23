import { ProductVariantCondition } from "@/shared/enums/product-variant-condition.enum"
import { CreateProductImageSchema } from "./product-image.dto"
import z from "zod"

const SalesAttributesSchema = z.object({
  key: z.string().trim().min(1, "Key is required."),
  label: z.string().trim().min(1, "Label is required."),
  value: z.string().trim().min(1, "Value is required."),
})

export const CreateProductVariantSchema = z.object({
  product: z.uuidv4(),

  price: z.number().min(0, "Base price must be at least 0."),

  discountPercent: z.number().min(0).max(100).optional().default(0),

  vat: z.number().min(0).max(100).optional().default(0),

  conditions: z.enum(ProductVariantCondition),

  salesAttributes: z
    .array(SalesAttributesSchema)
    .min(1, "At least 1 specification is required."),

  productImages: z
    .array(
      z.object({
        image: CreateProductImageSchema,
      })
    )
    .max(10, "You can upload up to 10 images."),
})

export const UpdateProductVariantSchema = CreateProductVariantSchema.partial()

export type CreateProductVariantDto = z.infer<typeof CreateProductVariantSchema>

export type UpdateProductVariantDto = z.infer<typeof UpdateProductVariantSchema>
