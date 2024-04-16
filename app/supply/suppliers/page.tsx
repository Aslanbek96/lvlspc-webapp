import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import prisma from "@/prisma/client";
import { SuppliersColumns } from "./add-supplier/components/suppliers-column";
import { PlusIcon } from "@radix-ui/react-icons";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany();
  return (
    <div className="flex flex-col gap-2 m-2">
      <div className="grid grid-cols-2 gap-2">
        <Button asChild className="my-2">
          <Link className="flex gap-2" href={"/supply/suppliers/add-supplier"}>
            <PlusIcon />
            Добавить поставщика
          </Link>
        </Button>
        <Button variant={"secondary"} asChild className="my-2">
          <Link className="flex gap-2" href={"/supply"}>
            Назад
          </Link>
        </Button>
      </div>
      <DataTable columns={SuppliersColumns} data={suppliers} />
    </div>
  );
}
