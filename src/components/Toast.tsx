import { useEffect, useState } from "react";

type ToastItem = { id: number; text: string };

let pushToast: ((text: string) => void) | null = null;
// eslint-disable-next-line react-refresh/only-export-components
export function toast(text: string) {
  pushToast?.(text);
}

export default function Toast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    pushToast = (text: string) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, text }]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 1800);
    };
    return () => { pushToast = null; };
  }, []);

  return (
    <div className="toast-container">
      {items.map((t) => (
        <div key={t.id} className="toast-item">{t.text}</div>
      ))}
    </div>
  );
}

