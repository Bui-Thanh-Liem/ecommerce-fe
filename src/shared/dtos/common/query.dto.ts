import z from "zod"

export const QueryDtoSchema = z.object({
  page: z.number().optional().default(1),
  limit: z
    .number()
    .max(100, "Limit number cannot be greater than 100")
    .optional()
    .default(10),
  filters: z.record(z.string(), z.string().optional()),
})

export type QueryDto = z.infer<typeof QueryDtoSchema>
