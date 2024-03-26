"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [initialName, setInitialName] = useState("");
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.MainButton.isVisible = true;
    tg.MainButton.hide();
    tg.MainButton.text = "Отправить данные";
    tg.headerColor = "secondary_bg_color";
    tg.ready();
    if (tg.initDataUnsafe?.user?.first_name) {
      setInitialName(tg.initDataUnsafe.user.first_name);
    }
  }, [setInitialName]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-24">
      <div className="w-[240px] flex flex-col gap-4 items-center">
        <div className="space-y-1 w-full">
          <Label>Ваше прежнее имя</Label>
          <Input className="w-full" defaultValue={initialName} />
        </div>
        <div className="space-y-1 w-full">
          <Label>Ваше новое имя</Label>
          <Input
            onChange={(e) => setUpdatedName(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          className="w-full"
          onClick={() => window.Telegram.WebApp.close()}
        >
          Сохранить
        </Button>
        <div className="flex gap-2">
          <Link href="/admin">Admin</Link>
          <Link href="/employee">Employee</Link>
        </div>
      </div>
    </main>
  );
}
