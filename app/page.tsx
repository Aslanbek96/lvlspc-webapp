"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function Home() {
  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    if (tg.initData) {
      setInitialName(tg.initDataUnsafe?.user?.first_name || "");
    }
  }, [setInitialName]);
  const handleClose = () => {
    const tg = window.Telegram.WebApp;

    tg.close();
  };

  console.log(initialName);

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-24">
      <div className="w-[240px] flex flex-col gap-4 items-center">
        <div className="space-y-1 w-full">
          <Label>Ваше прежнее имя</Label>
          <Input className="w-full" defaultValue={initialName} />
        </div>
        <div className="space-y-1 w-full">
          <Label>Ваше новое имя</Label>
          <Input className="w-full" />
        </div>
        <Button className="w-full" onClick={handleClose}>
          Сохранить
        </Button>
      </div>
    </main>
  );
}
