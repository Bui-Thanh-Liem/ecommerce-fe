import { Provider } from "@/shared/enums/provider.enum"
import z from "zod"

export const imageDtoSchema = z.object({
  provider: z.enum(Provider),
  url: z.url("Invalid URL format."),
  key: z.string().min(1, "Key is required."),
})

export type ImageDto = z.infer<typeof imageDtoSchema>
