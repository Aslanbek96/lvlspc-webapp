"use client";

import { Button } from "@/components/ui/button";
import { triggerAsyncId } from "async_hooks";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.MainButton.isVisible = true;
    tg.MainButton.hide();
    tg.MainButton.text = "Отправить данные";
    tg.headerColor = "secondary_bg_color";
    tg.ready();
  });
  const handleClose = () => {
    const tg = window.Telegram.WebApp;
    tg.close();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button onClick={handleClose}>Сохранить</Button>
    </main>
  );
}
