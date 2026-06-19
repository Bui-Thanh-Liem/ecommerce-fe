import z from "zod"

export const CreatePopularSearchSchema = z.object({
  text: z
    .string()
    .min(1, "Text is required.")
    .max(100, "Text must be at most 100 characters."),
})

export const UpdatePopularSearchSchema = CreatePopularSearchSchema.partial()

export type CreatePopularSearchDto = z.infer<typeof CreatePopularSearchSchema>
export type UpdatePopularSearchDto = z.infer<typeof UpdatePopularSearchSchema>
