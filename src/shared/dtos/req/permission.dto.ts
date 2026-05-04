import z from "zod"

export const UpdatePermissionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters.")
    .optional(),
  keyGroup: z
    .string()
    .min(1, "Key group is required.")
    .max(100, "Key group must be at most 100 characters.")
    .optional(),
  desc: z
    .string()
    .max(255, "Description must be at most 255 characters.")
    .optional(),
  isActive: z.boolean().optional(),
})

export type UpdatePermissionDto = z.infer<typeof UpdatePermissionSchema>
