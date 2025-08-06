import z from "zod";
import { ParcelStatus, ParcelTypes } from "./parcel.interface";

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
const updateAdminParcelSchema = z.object({
  status: z.enum(Object.values(ParcelStatus)),
  statusLog: z.object({
    notes: z.string(),
    location: z.string(),
  }),
  notes: z.string().optional(),
  fee: z.number("Fee is must be a number").optional(),
  isBlocked: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  deliveryDate: z
    .union([z.string(), z.date()])
    .transform((val) => new Date(val))
    .optional(),
});
const updateReceiverParcelSchema = z.object({
  status: z.enum([ParcelStatus.Delivered, ParcelStatus.Cancelled]),
});
const updateSenderParcelSchema = z.object({
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
  updateAdminParcelSchema,
  updateReceiverParcelSchema,
  updateSenderParcelSchema,
};
