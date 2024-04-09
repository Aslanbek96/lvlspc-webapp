import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(0).max(50),
  lastName: z.string().min(0).max(50),
  idNumber: z.string().min(0).length(12),
});
