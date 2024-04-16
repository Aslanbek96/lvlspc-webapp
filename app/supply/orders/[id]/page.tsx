import prisma from "@/prisma/client";
import ModifyOrder from "../components/modify-order";

export default async function SingleOrderPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
    },
    include: {
      supplier: true,
    },
  });

  const suppliers = await prisma.supplier.findMany();

  return (
    <div className="m-2">
      {order && <ModifyOrder suppliers={suppliers} order={order} />}
    </div>
  );
}
