import { Button } from "@/components/ui/button";
import prisma from "@/prisma/client";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import SingleOrderComponent from "./components/order-component";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: {
    location: string;
    status: string;
    date: string;
    amount: string;
  };
}) {
  const orders = await prisma.order.findMany({
    include: {
      supplier: true,
    },
  });
  return (
    <div className="m-2  flex flex-col gap-2">
      <div className=" grid grid-cols-2 gap-2">
        <Button asChild className="">
          <Link
            className="flex gap-2 items-center justify-center"
            href={"/supply/orders/create-order"}
          >
            <PlusCircledIcon />
            Добавить заказ
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link
            className="flex gap-2 items-center justify-center"
            href={"/supply"}
          >
            Назад
          </Link>
        </Button>
      </div>
      {orders.map((order) => (
        <SingleOrderComponent key={order.id} order={order} />
      ))}
    </div>
  );
}
