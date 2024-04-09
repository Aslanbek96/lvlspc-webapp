"use server";

import { z } from "zod";
import { createUserSchema } from "./zod-schemas";
import prisma from "@/prisma/client";

export const createUser = async (
  values: z.infer<typeof createUserSchema>,
  telegramId: number
) => {
  const user = await prisma.user.create({
    data: {
      ...values,
      telegramId,
    },
  });
  return user;
};
