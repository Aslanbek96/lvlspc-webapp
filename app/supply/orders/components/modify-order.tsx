"use client";

import { orderSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cancelOrder, modifyOrder } from "@/lib/actions";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@/lib/static";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Supplier } from "@prisma/client";
import { format } from "date-fns";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { OrderWithSupplier } from "./order-component";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function ModifyOrderComponent({
  suppliers,
  order,
}: {
  suppliers: Supplier[];
  order: OrderWithSupplier;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderDate: order.orderDate || undefined,
      paymentDate: order.paymentDate || undefined,
      deliveryDate: order.deliveryDate || undefined,
      status: order.status || "INITIALIZED",
      amount: order.amount || 0,
      location: order.location || undefined,
      supplierId: order.supplierId || undefined,
      isDelivered: order.isDelivered || false,
      invoice: order.invoice || undefined,
      receipt: order.receipt || undefined,
    },
  });

  const { setValue } = form;

  const uploadInvoiceFile = async (event: any) => {
    const file = event.target.files[0];
    const bucket = "invoices";
    const timestamp = new Date().toISOString();
    const filePath = timestamp;

    try {
      startTransition(async () => {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            upsert: true,
          });

        if (error) throw error;

        const { data } = await supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        setValue("invoice", data.publicUrl);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadReceiptFile = async (event: any) => {
    const file = event.target.files[0];
    const bucket = "invoices";
    const timestamp = new Date().toISOString();
    const filePath = timestamp;

    try {
      startTransition(async () => {
        const { error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            upsert: true,
          });

        if (error) throw error;

        const { data } = await supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        setValue("receipt", data.publicUrl);
      });
    } catch (error) {
      console.error(error);
    }
  };

  function onSubmit(values: z.infer<typeof orderSchema>) {
    startTransition(async () => {
      if (!values.paymentDate && !values.deliveryDate) {
        values.status = "INITIALIZED";
      }
      if (!values.paymentDate && values.deliveryDate && values.invoice) {
        values.status = "PENDING";
      }
      if (values.paymentDate && !values.deliveryDate) {
        values.status = "PAID";
      }
      if (values.deliveryDate && values.paymentDate) {
        values.status = "DELIVERED";
      }
      await modifyOrder(values, order.id);
      router.push("/supply/orders");
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <Label className="font-bold">1. Базовая информация</Label>
          <Separator />
          <FormField
            control={form.control}
            name="orderDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата заказа</FormLabel>
                <Popover>
                  <PopoverTrigger disabled asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd.MM.yyyy")
                        ) : (
                          <span>Выберите дату</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Сумма</FormLabel>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Локация</FormLabel>
                <Select
                  disabled
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.slice(0, -2).map((location) => (
                      <SelectItem key={location.id} value={location.nameEng}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Поставщик</FormLabel>
                <Select
                  disabled
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Label className="font-bold">2. Информация по оплате</Label>
          <Separator />
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-2">
              <Label>Счет на оплату</Label>
              {order.invoice ? (
                <Button asChild>
                  <Link href={order.invoice} target="_blank">
                    Открыть счет
                  </Link>
                </Button>
              ) : (
                <FormField
                  control={form.control}
                  name="invoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="file" onChange={uploadInvoiceFile} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Дата оплаты</Label>
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger
                        disabled={order.paymentDate ? true : false}
                        asChild
                      >
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              " pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd.MM.yyyy")
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Чек оплаты</Label>
              {order.receipt ? (
                <Button asChild>
                  <Link href={order.receipt} target="_blank">
                    Открыть чек
                  </Link>
                </Button>
              ) : (
                <FormField
                  control={form.control}
                  name="receipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="file" onChange={uploadReceiptFile} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <Label className="font-bold">3. Информация по оприходу</Label>
          <Separator />
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата доставки</FormLabel>
                <Popover>
                  <PopoverTrigger
                    disabled={order.deliveryDate ? true : false}
                    asChild
                  >
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd.MM.yyyy")
                        ) : (
                          <span>Выберите дату</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            {isPending ? <Loader className="animate-spin" /> : "Сохранить"}
          </Button>
        </form>
      </Form>
      <Button
        variant={"secondary"}
        className="w-full"
        onClick={() => router.push("/supply/orders")}
      >
        Назад
      </Button>
      <Button
        variant={"destructive"}
        className="w-full"
        onClick={async () => {
          await cancelOrder(order.id);
          router.push("/supply/orders");
        }}
      >
        Отменить заказ
      </Button>
    </>
  );
}
