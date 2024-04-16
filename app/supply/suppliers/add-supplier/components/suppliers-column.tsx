"use client";

import { Button } from "@/components/ui/button";
import { Supplier } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

export const SuppliersColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "name",
    header: "Наименование",
  },
  {
    accessorKey: "contactPerson",
    header: "Конт. лицо",
  },
  {
    accessorKey: "phone",
    header: "Телефон",
  },
  {
    accessorKey: "discount",
    header: "Скидка",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <Button variant={"ghost"}>
          <Link href={`/supply/suppliers/${supplier.id}`}>
            <DotsHorizontalIcon />
          </Link>
        </Button>
      );
    },
  },
];
