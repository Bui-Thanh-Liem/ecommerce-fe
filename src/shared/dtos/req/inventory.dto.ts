import { InventoryStockType } from "@/shared/enums/inventory-stock-type.enum"
import z from "zod"

export const CreateInventorySchema = z.object({
  store: z.uuidv4(),

  productVariant: z.uuidv4(),

  quantity: z.number().min(0, "Quantity must be at least 0."),

  minStockLevel: z.number().min(0, "Minimum stock level must be at least 0."),

  stockType: z.enum(InventoryStockType),
})

export const UpdateInventorySchema = CreateInventorySchema.partial()

export type CreateInventoryDto = z.infer<typeof CreateInventorySchema>

export type UpdateInventoryDto = z.infer<typeof UpdateInventorySchema>
