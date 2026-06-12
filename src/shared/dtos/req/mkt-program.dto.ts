import z from "zod"
import { imageDtoSchema } from "../common/image.dto"
import { MarketingProgramStatus } from "@/shared/enums/marketing-program-status.enum"

export const CreateMktProgramSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),

  desc: z
    .string()
    .min(1, "Description is required.")
    .max(200, "Description must be at most 200 characters."),

  mainImage: imageDtoSchema.optional(),

  status: z.enum(MarketingProgramStatus).optional(),

  startDate: z
    .date()
    .optional()
    .default(() => new Date()),

  endDate: z
    .date()
    .optional()
    .default(() => {
      const date = new Date()
      date.setDate(date.getDate() + 7) // Mặc định kết thúc sau 7 ngày
      return date
    }),

  campaigns: z.array(z.uuidv4()).max(5).optional(),
})

export const UpdateMktProgramSchema = CreateMktProgramSchema.partial()

export type CreateMktProgramDto = z.infer<typeof CreateMktProgramSchema>
export type UpdateMktProgramDto = z.infer<typeof UpdateMktProgramSchema>
