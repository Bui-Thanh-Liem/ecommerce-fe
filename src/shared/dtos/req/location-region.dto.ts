import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import z from "zod"

export const CreateLocationRegionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(255, "Name must be at most 255 characters."),
  type: z.enum(LocationRegionType),
  parent: z.uuidv4(),
})

export const SelectLocationRegionSchema = z.object({
  wardCommune: z.uuidv4("Phường xã không hợp lệ."),
  districtTown: z.uuidv4("Quận/huyện không hợp lệ."),
  provinceCity: z.uuidv4("Tỉnh/thành phố không hợp lệ."),
  country: z.uuidv4("Quốc gia không hợp lệ."),
  addressDetail: z.string(),
})

export const UpdateLocationRegionSchema = CreateLocationRegionSchema.partial()

export type CreateLocationRegionDto = z.infer<typeof CreateLocationRegionSchema>
export type UpdateLocationRegionDto = z.infer<typeof UpdateLocationRegionSchema>
export type SelectLocationRegionDto = z.infer<typeof SelectLocationRegionSchema>
