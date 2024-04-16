"use server";

import { z } from "zod";
import { createUserSchema, orderSchema, supplierSchema } from "./zod-schemas";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const createUser = async (
  values: z.infer<typeof createUserSchema>,
  telegramId: number
) => {
  try {
    const user = await prisma.user.create({
      data: {
        ...values,
        telegramId,
      },
    });
    revalidatePath("/users");
    return user;
  } catch (error) {
    console.error(error);
  }
};

export const createSupplier = async (
  values: z.infer<typeof supplierSchema>
) => {
  try {
    const supplier = await prisma.supplier.create({
      data: values,
    });
    revalidatePath("/supply/suppliers");
    return supplier;
  } catch (error) {
    console.error(error);
  }
};

export const createOrder = async (values: z.infer<typeof orderSchema>) => {
  try {
    const order = await prisma.order.create({
      data: values,
    });
    revalidatePath("/supply/orders");
    return order;
  } catch (error) {
    console.error(error);
  }
};

export const modifyOrder = async (
  values: z.infer<typeof orderSchema>,
  id: string
) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: id,
      },
      data: values,
    });
    revalidatePath("/supply/orders");
    return order;
  } catch (error) {
    console.error(error);
  }
};

export const cancelOrder = async (id: string) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: "CANCELLED",
      },
    });
    revalidatePath("/supply/orders");
    return order;
  } catch (error) {
    console.error(error);
  }
};
