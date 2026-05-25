import { ProductItemStatus } from "@/shared/enums/product-item-status.enum"
import z from "zod"

export const CreateProductItemSchema = z.object({
  productVariant: z.uuidv4(),

  inventory: z.uuidv4(),

  serialNumber: z.string().trim().min(1, "Barcode is required."),

  purchasePrice: z.number().min(0, "Purchase price must be at least 0."),

  locationInWarehouse: z
    .string()
    .trim()
    .min(1, "Location in warehouse is required."),

  status: z.enum(ProductItemStatus),
})

export const UpdateProductItemSchema = CreateProductItemSchema.partial()

export type CreateProductItemDto = z.infer<typeof CreateProductItemSchema>

export type UpdateProductItemDto = z.infer<typeof UpdateProductItemSchema>
