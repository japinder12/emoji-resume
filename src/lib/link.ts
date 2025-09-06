export type State = {
  lines: string[];
  theme: "light" | "dark";
  density: "minimal" | "medium" | "extra";
};

export function stateToHash(s: State) {
  const payload = JSON.stringify(s);
  const encoded = btoa(unescape(encodeURIComponent(payload)));
  return "#" + encoded;
}

export function hashToState(hash: string): State | null {
  if (!hash?.startsWith("#")) return null;
  try {
    const json = decodeURIComponent(escape(atob(hash.slice(1))));
    return JSON.parse(json) as State;
  } catch { return null; }
}
