import z from "zod";
import { UserRole } from "./user.interface";

const userCreateSchema = z.object({
  name: z
    .string("Name is must be a string")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be at most 50 characters long"),
  email: z.email(),
  phone: z.string().min(11, "Phone number must be at least 10 characters long"),
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
const userUpdateSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long")
      .optional(),
    email: z.email().optional(),
    phone: z
      .string()
      .min(11, "Phone number must be at least 10 characters long")
      .optional(),
    address: z.string().optional(),
    role: z.enum([UserRole.RECEIVER, UserRole.SENDER]).optional(),
    password: z.string().optional(),
    isDeleted: z.boolean().optional(),
    isBlocked: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if ("password" in data) {
      ctx.addIssue({
        path: ["password"],
        code: "custom",
        message: "Password cannot be updated from this route.",
      });
    }
  });

export const userValidation = { userCreateSchema, userUpdateSchema };
