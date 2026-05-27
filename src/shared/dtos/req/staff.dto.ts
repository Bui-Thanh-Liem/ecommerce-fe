import { REGEX_PASSWORD, REGEX_PHONE } from "@/shared/constants/regex.constant"
import { MAX_ROLES_IN_STAFF } from "@/shared/constants/staff.constant"
import z from "zod"
import { imageDtoSchema } from "../common/image.dto"

export const StaffBaseSchema = z.object({
  avatar: imageDtoSchema.optional(),

  fullName: z
    .string()
    .min(1, "Full name is required.")
    .max(50, "Full name must be at most 50 characters."),

  phone: z
    .string()
    .min(3, "Phone must be at least 3 characters.")
    .max(20, "Phone must be at most 20 characters.")
    .regex(REGEX_PHONE, "Phone can only contain numbers."),

  email: z.email("Invalid email format."),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters.")
    .regex(
      REGEX_PASSWORD,
      "Password must contain at least one letter, one number and one special character."
    ),

  confirmPassword: z
    .string()
    .min(6, "Confirm password must be at least 6 characters.")
    .optional(),

  workLocationID: z.string().min(1, "Work location is required."),

  directManager: z.uuidv4("Direct manager must be a valid UUID."),

  roles: z
    .array(z.uuidv4())
    .max(
      MAX_ROLES_IN_STAFF,
      `You can select at most ${MAX_ROLES_IN_STAFF} roles.`
    )
    .optional(),

  store: z.uuidv4().optional(),

  isActive: z.boolean().optional(),

  isSubAdmin: z.boolean().optional(),
})

export const CreateStaffSchema = StaffBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
)

export const UpdateStaffSchema = StaffBaseSchema.partial().extend({
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
})

export type CreateStaffDto = z.infer<typeof StaffBaseSchema>
export type UpdateStaffDto = z.infer<typeof UpdateStaffSchema>
