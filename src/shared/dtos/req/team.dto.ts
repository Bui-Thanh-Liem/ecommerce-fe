import z from "zod"

export const CreateTeamSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
  desc: z
    .string()
    .max(255, "Description must be at most 255 characters.")
    .optional(),
  leader: z.uuidv4(),
  category: z.uuidv4(),
  members: z.array(z.uuidv4()).nonempty("At least one member is required."),
  store: z.uuidv4().optional(),
  isActive: z.boolean().optional(),
})

export const UpdateTeamSchema = CreateTeamSchema.partial()

export type CreateTeamDto = z.infer<typeof CreateTeamSchema>
export type UpdateTeamDto = z.infer<typeof UpdateTeamSchema>
