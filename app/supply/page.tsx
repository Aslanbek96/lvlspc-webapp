import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function SupplyPage() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Button asChild className="m-2">
        <Link href={"/supply/orders"}>Заявки</Link>
      </Button>
      <Button asChild className="m-2">
        <Link href={"/supply/suppliers"}>Поставщики</Link>
      </Button>
      <Button asChild className="m-2">
        <Link href={"/supply/commodities"}>Товары</Link>
      </Button>
    </div>
  );
}
