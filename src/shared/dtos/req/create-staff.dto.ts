import { REGEX_PASSWORD, REGEX_PHONE } from "@/shared/constants/regex.contstant";
import z from "zod";

export const CreateStaffSchema = z.object({
  fullName: z.string()
    .min(1, "Full name is required.")
    .max(50, "Full name must be at most 50 characters."),

  phone: z.string()
    .min(3, "Phone must be at least 3 characters.")
    .max(20, "Phone must be at most 20 characters.")
    .regex(
      REGEX_PHONE,
      "Phone can only contain numbers."
    ),

  email: z.email("Invalid email format."),

  password: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters.")
    .regex(
      REGEX_PASSWORD,
      "Password must contain at least one letter, one number and one special character."
    ),

  store: z.uuidv4(),

  roles: z.array(z.uuidv4())
})

export type CreateStaffDto = z.infer<typeof CreateStaffSchema>