import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import prisma from "@/prisma/client";
import { OrderColumns } from "./components/order-columns";

export default async function SingleSupplierPage({
  params,
}: {
  params: { id: string };
}) {
  const supplier = await prisma.supplier.findUnique({
    where: {
      id: params.id,
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      supplierId: params.id,
    },
  });

  return (
    <div className="m-2  flex flex-col gap-2">
      <div className="space-y-2">
        <Label>Название</Label>
        <Input defaultValue={supplier?.name} />
      </div>
      <div className="space-y-2">
        <Label>Контактное лицо</Label>
        <Input defaultValue={supplier?.contactPerson} />
      </div>
      <div className="space-y-2">
        <Label>Телефон</Label>
        <Input defaultValue={supplier?.phone} />
      </div>
      <div className="space-y-2">
        <Label>Скидка</Label>
        <Input defaultValue={supplier?.discount} />
      </div>
      <DataTable columns={OrderColumns} data={orders} />
    </div>
  );
}
