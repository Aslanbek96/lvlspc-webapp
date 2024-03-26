"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function CreateUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.MainButton.text = "Отправить данные";
    tg.ready();
  }, []);

  useEffect(() => {
    if (firstName && lastName) {
      window.Telegram.WebApp.MainButton.hide();
    } else {
      window.Telegram.WebApp.MainButton.show();
    }
  }, [firstName, lastName]);

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <h1 className="text-md font-semibold">Введите ваши даные</h1>
      <div className="w-full space-y-1">
        <Label className="text-sm font-semibold">Имя</Label>
        <Input onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="w-full space-y-1">
        <Label className="text-sm font-semibold">Фамилия</Label>
        <Input onChange={(e) => setLastName(e.target.value)} />
      </div>
    </div>
  );
}
