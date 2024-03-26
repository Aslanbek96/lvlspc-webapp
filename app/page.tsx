"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WebApp } from "@grammyjs/web-app";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    WebApp.ready();
  });
  const handleClose = () => {
    WebApp.close();
  };

  // const tg = window.Telegram.WebApp;

  return (
    <main className="flex min-h-screen flex-col items-center gap-2 p-24">
      <div className="w-[240px] flex flex-col gap-4 items-center">
        <div className="space-y-1 w-full">
          <Label>Ваше прежнее имя</Label>
          <Input className="w-full" />
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
