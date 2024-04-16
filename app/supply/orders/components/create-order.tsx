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
import { createOrder } from "@/lib/actions";
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
import { Checkbox } from "@/components/ui/checkbox";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CreateOrderComponent({
  suppliers,
}: {
  suppliers: Supplier[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderDate: new Date(),
      paymentDate: undefined,
      deliveryDate: undefined,
      status: "INITIALIZED",
      amount: 0,
      location: undefined,
      supplierId: undefined,
      isDelivered: false,
      invoice: undefined,
      receipt: undefined,
    },
  });

  const watchIsDelivered = form.watch("isDelivered");
  const { setValue } = form;

  function onSubmit(values: z.infer<typeof orderSchema>) {
    startTransition(async () => {
      if (values.isDelivered) {
        values.orderDate = values.deliveryDate || new Date();
      }
      if (!values.isDelivered) {
        values.status = "PENDING";
      }
      await createOrder(values);
      router.push("/supply/orders");
    });
  }

  const uploadFile = async (event: any) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="isDelivered"
          render={({ field }) => (
            <FormItem className="flex flex-row  items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Товар пришел но нет счета оплату</FormLabel>
            </FormItem>
          )}
        />
        {watchIsDelivered ? (
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата доставки</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
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
        ) : (
          <FormField
            control={form.control}
            name="orderDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата заказа</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
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
        )}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сумма</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        {!watchIsDelivered && (
          <FormField
            control={form.control}
            name="invoice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Счет на оплату</FormLabel>
                <FormControl>
                  <Input type="file" onChange={uploadFile} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button className="w-full" type="submit">
          {isPending ? <Loader className="animate-spin" /> : "Сохранить"}
        </Button>
        <Button
          variant={"secondary"}
          className="w-full"
          onClick={() => router.push("/supply/orders")}
        >
          Назад
        </Button>
      </form>
    </Form>
  );
}
