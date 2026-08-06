import z from "zod"

export const CreateCustomerAddressSchema = z.object({
  country: z.uuidv4(),
  provinceCity: z.uuidv4(),
  districtTown: z.uuidv4(),
  wardCommune: z.uuidv4(),
  address: z.string().min(1, "Address is required.").max(255, "Address must be at most 255 characters."),
  lat: z.number(),
  lng: z.number(),

  recipientName: z
    .string()
    .min(1, "Recipient name is required.")
    .max(50, "Recipient name must be at most 50 characters."),

  recipientPhone: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\+?[0-9]{7,15}$/, "Phone number must be valid")
    .max(20, "Phone number must be at most 20 characters."),

  isDefault: z.boolean().optional(),
})

export const UpdateCustomerAddressSchema = CreateCustomerAddressSchema.partial()

export type CreateCustomerAddressDto = z.infer<typeof CreateCustomerAddressSchema>
export type UpdateCustomerAddressDto = z.infer<typeof UpdateCustomerAddressSchema>
