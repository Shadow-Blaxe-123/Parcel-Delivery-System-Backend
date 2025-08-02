import z from "zod";
import { UserRole } from "./user.interface";

const userCreateSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[A-Z])/, {
      error: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      error: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      error: "Password must contain at least 1 number.",
    }),
  address: z.string(),
  role: z.enum([UserRole.RECEIVER, UserRole.SENDER]),
});

export const userValidation = { userCreateSchema };
