import z from "zod"

export const queryDtoSchema = z.object({
  page: z.number().default(1).optional(),
  limit: z
    .number()
    .max(100, "Limit number cannot be greater than 100")
    .default(10)
    .optional(),
  filters: z.record(z.string(), z.any()).optional(),
})

export type QueryDto<TFilters = Record<string, any>> = z.infer<
  typeof queryDtoSchema
> & {
  filters?: Partial<TFilters>
}
