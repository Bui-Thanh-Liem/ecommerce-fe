import z from "zod"

export const CreateMenuSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be at most 50 characters."),

  category: z.uuidv4(),

  isActive: z.boolean().optional(),
})

export const UpdateMenuSchema = CreateMenuSchema.partial()

export type CreateMenuDto = z.infer<typeof CreateMenuSchema>
export type UpdateMenuDto = z.infer<typeof UpdateMenuSchema>
