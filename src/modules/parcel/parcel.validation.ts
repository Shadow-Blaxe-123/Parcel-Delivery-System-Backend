import z from "zod";
import { ParcelTypes } from "./parcel.interface";

const createParcelSchema = z.object({
  title: z
    .string("Title is must be a string")
    .min(3, "Title must be at least 3 characters long")
    .max(50, "Title must be at most 50 characters long"),
  weight: z.number("Weight is must be a number"),
  deliveryDate: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val)),
  receiverEmail: z.email(),
  fee: z.number("Fee is must be a number"),
  type: z.enum(Object.values(ParcelTypes)),
});

export const ParcelValidation = {
  createParcelSchema,
};
