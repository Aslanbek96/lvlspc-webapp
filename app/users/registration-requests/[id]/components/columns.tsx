"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Имя",
  },
  {
    accessorKey: "lastName",
    header: "Фамилия",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return <ChevronDown />;
    },
  },
];
