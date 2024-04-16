"use client";

import { Order, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

export const OrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderDate",
    header: "Дата заказа",
  },
  {
    accessorKey: "paymentDate",
    header: "Дата оплаты",
  },
  {
    accessorKey: "deliveryDate",
    header: "Дата оприхода",
  },
  {
    accessorKey: "location",
    header: "Локация",
  },
  {
    accessorKey: "amount",
    header: "Сумма",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return <ChevronDown />;
    },
  },
];
