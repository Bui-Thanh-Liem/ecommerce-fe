import { LocationRegionType } from "@/shared/enums/location-region-type.enum"
import z from "zod"

const GeoJsonSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
  }),
  z.object({
    type: z.enum(["LineString", "MultiPoint"]),
    coordinates: z.array(z.tuple([z.number(), z.number()])),
  }),
  z.object({
    type: z.enum(["Polygon", "MultiLineString"]),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
  }),
  z.object({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])))),
  }),
])

export const CreateLocationRegionSchema = z.object({
  area: GeoJsonSchema.optional(),
  type: z.enum(LocationRegionType),
  parent: z.uuidv4({ message: "Khu vực cha không hợp lệ." }),
  name: z.string().min(1, "Tên không được để trống.").max(255, "Tên không được vượt quá 255 ký tự."),
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
