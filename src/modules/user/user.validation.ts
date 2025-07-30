import z from "zod";
import { UserRole } from "./user.interface";

const userCreateSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  address: z.string(),
  role: z.enum(UserRole),
});

export const userCreateValidation = { userCreateSchema };
