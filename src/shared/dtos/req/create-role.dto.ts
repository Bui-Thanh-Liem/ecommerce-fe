import z from "zod"

export const CreateRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
  desc: z
    .string()
    .min(1, "Description is required.")
    .max(255, "Description must be at most 255 characters.")
    .optional(),
  permissions: z.array(z.uuidv4()).nonempty("Permissions cannot be empty."),
  isActive: z.boolean().optional(),
})

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>
