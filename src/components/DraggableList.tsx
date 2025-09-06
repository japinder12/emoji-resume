import { useRef, useState } from "react";

export default function DraggableList({
  lines, setLines
}: { lines: string[]; setLines: (v: string[]) => void }) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const overIdx = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const onDragStart = (i: number) => () => setDragIdx(i);
  const onDragOver = (i: number) => (e: React.DragEvent) => {
    e.preventDefault();
    overIdx.current = i;
    // Auto-scroll when dragging near edges of the list container
    const listEl = listRef.current;
    if (!listEl) return;
    const rect = listEl.getBoundingClientRect();
    const threshold = 28; // px from top/bottom to start scrolling
    const speed = 12; // px per event, feels smooth enough
    if (e.clientY - rect.top < threshold) {
      listEl.scrollTop -= speed;
    } else if (rect.bottom - e.clientY < threshold) {
      listEl.scrollTop += speed;
    }
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
    <ul ref={listRef} className="list list-draggable">
      {lines.map((l, i) => (
        <li key={i}
            draggable
            onDragStart={onDragStart(i)}
            onDragOver={onDragOver(i)}
            onDrop={onDrop}
            className="list-item cursor-grab">
          <span className="drag-handle" aria-hidden>≡</span>
          <input
            value={l}
            onChange={e => {
              const copy = [...lines]; copy[i] = e.target.value; setLines(copy);
            }}
            className="list-input list-edit"
          />
        </li>
      ))}
    </ul>
  );
}
