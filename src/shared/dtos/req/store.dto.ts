import z from "zod"
import { imageDtoSchema } from "../common/image.dto"

const PhoneStoreSchema = z.object({
  name: z
    .string()
    .min(1, "Phone name is required.")
    .max(50, "Phone name must be at most 50 characters."),
  phone: z
    .string()
    .min(3, "Phone number must be at least 3 characters.")
    .max(20, "Phone number must be at most 20 characters."),
})

export const CreateStoreSchema = z.object({
  // Location
  country: z.uuidv4("Country must be a valid UUID."),
  provinceCity: z.uuidv4("Province/City must be a valid UUID."),
  districtTown: z.uuidv4("District/Town must be a valid UUID."),
  wardCommune: z.uuidv4("Ward/Commune must be a valid UUID."),
  address: z
    .string()
    .min(1, "Address is required.")
    .max(200, "Address must be at most 200 characters."),
  lat: z.number(),
  lng: z.number(),

  // Store Info
  isActive: z.boolean().optional(),
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
  image: imageDtoSchema.optional(),
  openingHours: z
    .string()
    .min(1, "Opening hours is required.")
    .max(10, "Opening hours must be at most 10 characters."),
  closingHours: z
    .string()
    .min(1, "Closing hours is required.")
    .max(10, "Closing hours must be at most 10 characters."),
  phone: z
    .array(PhoneStoreSchema)
    .nonempty("At least one phone number is required."),
  manager: z.uuidv4("Manager must be a valid UUID."),
})

export const UpdateStoreSchema = CreateStoreSchema.partial()

export type PhoneStore = z.infer<typeof PhoneStoreSchema>

export type CreateStoreDto = z.infer<typeof CreateStoreSchema>
export type UpdateStoreDto = z.infer<typeof UpdateStoreSchema>
