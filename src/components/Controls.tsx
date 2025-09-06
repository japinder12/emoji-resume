import { Density } from "../lib/emojiMap";

export function Controls(props: {
  density: Density;
  setDensity: (d: Density) => void;
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
  onExport: () => void;
  onCopy: () => void;
  onShare: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <label className="text-sm">
        Density&nbsp;
        <select
          className="border rounded-md px-2 py-1"
          value={props.density}
          onChange={(e) => props.setDensity(e.target.value as Density)}
        >
          <option>minimal</option>
          <option>medium</option>
          <option>extra</option>
        </select>
      </label>
      <label className="text-sm">
        Theme&nbsp;
        <select
          className="border rounded-md px-2 py-1"
          value={props.theme}
          onChange={(e) => props.setTheme(e.target.value as "light" | "dark")}
        >
          <option>light</option>
          <option>dark</option>
        </select>
      </label>
      <button onClick={props.onCopy} className="px-3 py-1.5 rounded-lg border text-sm">
        Copy emojis
      </button>
      <button onClick={props.onExport} className="px-3 py-1.5 rounded-lg border text-sm">
        Export PNG
      </button>
      <button onClick={props.onShare} className="px-3 py-1.5 rounded-lg border text-sm">
        Share permalink
      </button>
    </div>
  );
}
