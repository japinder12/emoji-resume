import { useRef, useState } from "react";

export default function DraggableList({
  lines, setLines
}: { lines: string[]; setLines: (v: string[]) => void }) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const overIdx = useRef<number | null>(null);

  const onDragStart = (i: number) => () => setDragIdx(i);
  const onDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault(); overIdx.current = i;
  };
  const onDrop = () => {
    if (dragIdx == null || overIdx.current == null) return;
    const copy = [...lines];
    const [moved] = copy.splice(dragIdx, 1);
    copy.splice(overIdx.current, 0, moved);
    setLines(copy);
    setDragIdx(null); overIdx.current = null;
  };

  return (
    <ul className="border rounded-xl divide-y bg-white">
      {lines.map((l, i) => (
        <li key={i}
            draggable
            onDragStart={onDragStart(i)}
            onDragOver={onDragOver(i)}
            onDrop={onDrop}
            className="p-2 flex items-start gap-2 cursor-grab hover:bg-slate-50">
          <span className="opacity-60">≡</span>
          <input
            value={l}
            onChange={e => {
              const copy = [...lines]; copy[i] = e.target.value; setLines(copy);
            }}
            className="flex-1 bg-transparent outline-none"
          />
        </li>
      ))}
    </ul>
  );
}
