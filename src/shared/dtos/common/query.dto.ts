import z from "zod"

export const QueryDtoSchema = z.object({
  page: z.number().default(1).optional(),
  limit: z
    .number()
    .max(100, "Limit number cannot be greater than 100")
    .default(10)
    .optional(),
  filters: z.record(z.string(), z.string().optional()),
})

export type QueryDto = z.infer<typeof QueryDtoSchema>
