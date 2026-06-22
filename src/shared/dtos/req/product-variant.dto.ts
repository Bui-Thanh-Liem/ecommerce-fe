import { ProductVariantCondition } from "@/shared/enums/product-variant-condition.enum"
import { CreateProductImageSchema } from "./product-image.dto"
import z from "zod"
import { SpecificationItemSchema } from "./product.dto"

const SalesAttributesSchema = SpecificationItemSchema.extend({
  isSKU: z.boolean(),
})

export const CreateProductVariantSchema = z.object({
  product: z.uuidv4(),

  vat: z.number().min(0).max(100).optional().default(0),

  barcode: z.string().trim().min(1, "Barcode is required."),

  price: z.number().min(0, "Base price must be at least 0."),

  costPrice: z.number().min(0, "Cost price must be at least 0."),

  discountPercent: z.number().min(0).max(100).optional().default(0),

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
