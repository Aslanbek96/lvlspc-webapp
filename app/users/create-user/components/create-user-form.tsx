"use client";

import { createUserSchema } from "@/lib/zod-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { createUser } from "@/lib/actions";

export default function CreateUserForm() {
  const [telegramId, setTelegramId] = useState(1);
  const [queryId, setQueryId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.MainButton.isVisible = true;
    tg.MainButton.show();
    tg.MainButton.text = "Отправить данные";
    tg.headerColor = "secondary_bg_color";
    tg.ready();
    setTelegramId(tg.initDataUnsafe?.user?.id || 0);
    tg.ready();
    setQueryId(tg.initDataUnsafe?.query_id || "");
    setUsername(tg.initDataUnsafe?.user?.username || "");
  }, [setTelegramId]);

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      idNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createUserSchema>) {
    await createUser(values, telegramId);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-[200px]"
      >
        {telegramId}
        {queryId}
        {username}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Фамилия</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ИИН</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Сохранить
        </Button>
      </form>
    </Form>
  );
}
