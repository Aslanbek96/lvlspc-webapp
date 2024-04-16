import CreateOrderComponent from "../components/create-order";
import prisma from "@/prisma/client";

export default async function AddOrderPage() {
  const suppliers = await prisma.supplier.findMany();

  return (
    <div className="m-2">
      <CreateOrderComponent suppliers={suppliers} />
    </div>
  );
}
