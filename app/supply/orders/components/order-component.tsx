import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orderStatus } from "@/lib/static";
import { Order, Supplier } from "@prisma/client";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

export type OrderWithSupplier = Order & {
  supplier: Supplier;
};

export default function SingleOrderComponent({
  order,
}: {
  order: OrderWithSupplier;
}) {
  const localOrderStatus = orderStatus.find(
    (status) => status.status === order.status
  );

  return (
    <div className="p-2 flex flex-col gap-1 border rounded text-xs w-[200px]">
      <div className="flex justify-between">
        <Badge
          style={{
            backgroundColor: localOrderStatus?.color,
            color: "black",
            width: "fit-content",
          }}
        >
          {localOrderStatus?.statusRu}
        </Badge>
        <Link href={`/supply/orders/${order.id}`}>
          <OpenInNewWindowIcon />
        </Link>
      </div>
      <p>{order.orderDate?.toLocaleDateString("ru-Ru")}</p>
      <p>{order.supplier.name}</p>
    </div>
  );
}
