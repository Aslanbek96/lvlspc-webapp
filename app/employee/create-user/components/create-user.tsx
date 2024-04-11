"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { set } from "zod";

export default function CreateUserForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [queryId, setQueryId] = useState("");
  const [telegramId, setTelegramId] = useState(1);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.MainButton.text = "Отправить данные";
    setQueryId(tg.initDataUnsafe?.query_id || "");
    setTelegramId(tg.initDataUnsafe?.user?.id || 0);
    tg.ready();
  }, []);

  useEffect(() => {
    if (firstName && lastName) {
      window.Telegram.WebApp.MainButton.show();
    } else {
      window.Telegram.WebApp.MainButton.hide();
    }
  }, [firstName, lastName]);

  const onSendData = useCallback(() => {
    const data = {
      firstName,
      lastName,
      queryId: window.Telegram.WebApp.initDataUnsafe?.query_id,
    };
    fetch("https://lvlspc.dev/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }, [firstName, lastName]);

  useEffect(() => {
    window.Telegram.WebApp.onEvent("mainButtonClicked", onSendData);
    return () => {
      window.Telegram.WebApp.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    if (firstName || lastName) {
      window.Telegram.WebApp.enableClosingConfirmation();
    } else {
      window.Telegram.WebApp.disableClosingConfirmation();
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
      <p>{queryId}</p>
      <p>{telegramId}</p>
    </div>
  );
}
