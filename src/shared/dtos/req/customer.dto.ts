import z from "zod"

export const LoginCustomerSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\+?[0-9]{7,15}$/, "Phone number must be valid")
    .max(20, "Phone number must be at most 20 characters."),
})

export const UpdateCustomerSchema = LoginCustomerSchema.partial().extend({
  fullname: z
    .string()
    .min(1, "Full name is required.")
    .max(50, "Full name must be at most 50 characters.")
    .optional(),

  email: z
    .email("Email must be valid")
    .max(100, "Email must be at most 100 characters.")
    .optional(),

  address: z.array(z.string()).optional(),

  isActive: z.boolean().optional(),
})

export const VerifyLoginOtpCustomerSchema = LoginCustomerSchema.extend({
  otp: z
    .string()
    .min(6, "OTP must be at least 6 characters.")
    .max(6, "OTP must be at most 6 characters."),
})

export type LoginCustomerDto = z.infer<typeof LoginCustomerSchema>
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>
export type VerifyLoginOtpCustomerDto = z.infer<
  typeof VerifyLoginOtpCustomerSchema
>
