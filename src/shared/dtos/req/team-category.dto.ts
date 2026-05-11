import { TeamCategoryCode } from "@/shared/enums/team-category-code.enum"
import { TeamType } from "@/shared/enums/team-type.enum"
import z from "zod"

export const CreateTeamCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
  code: z.enum(TeamCategoryCode),
  type: z.enum(TeamType),
})

export const UpdateTeamCategorySchema = CreateTeamCategorySchema.partial()

export type CreateTeamCategoryDto = z.infer<typeof CreateTeamCategorySchema>
export type UpdateTeamCategoryDto = z.infer<typeof UpdateTeamCategorySchema>
