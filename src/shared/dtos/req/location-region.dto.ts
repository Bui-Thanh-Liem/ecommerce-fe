import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import z from "zod"

export const CreateLocationRegionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(255, "Name must be at most 255 characters."),
  type: z.enum(LocationRegionType),
  parent: z.uuidv4().optional(),
})

export type CreateLocationRegionDto = z.infer<typeof CreateLocationRegionSchema>
