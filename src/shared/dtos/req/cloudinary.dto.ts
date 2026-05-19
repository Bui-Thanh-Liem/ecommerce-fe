import z from "zod"

export const SignatureSchema = z.object({
  folder: z
    .string()
    .min(1, "Folder is required.")
    .max(50, "Folder must be at most 50 characters."),
})

export type SignatureDto = z.infer<typeof SignatureSchema>
