import { useEffect, useState } from "react";
import { setToastHandler } from "../lib/toast";

type ToastItem = { id: number; text: string };

export default function Toast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    setToastHandler((text: string) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, text }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 1800);
    });
    return () => { setToastHandler(null); };
  }, []);

  return (
    <div className="toast-container">
      {items.map((t) => (
        <div key={t.id} className="toast-item">{t.text}</div>
      ))}
    </div>
  );
}

