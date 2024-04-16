import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(0).max(50),
  lastName: z.string().min(0).max(50),
  idNumber: z.string().min(0).length(12),
});

export const supplierSchema = z.object({
  name: z.string().min(0).max(50),
  contactPerson: z.string().min(0).max(50),
  phone: z.string().min(0).max(50),
  discount: z.string().min(0).max(100),
});

export const orderSchema = z.object({
  orderDate: z.date(),
  isDelivered: z.boolean(),
  invoice: z.string().optional(),
  receipt: z.string().optional(),
  paymentDate: z.date().optional(),
  deliveryDate: z.date().optional(),
  status: z.enum(["INITIALIZED", "PENDING", "PAID", "DELIVERED", "CANCELLED"]),
  location: z.string(),
  amount: z.coerce.number(),
  supplierId: z.string(),
});
