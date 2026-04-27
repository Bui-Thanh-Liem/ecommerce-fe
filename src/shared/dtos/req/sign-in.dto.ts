import z from "zod";

export const SignInFormSchema = z.object({
  phone: z
    .string()
    .min(3, "Phone must be at least 3 characters.")
    .max(20, "Phone must be at most 20 characters.")
    .regex(
      /^[0-9]+$/,
      "Phone can only contain numbers."
    ),
  password: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password must be at most 100 characters.")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one letter, one number and one special character."
    ),
})

export type SignInDto = z.infer<typeof SignInFormSchema>;