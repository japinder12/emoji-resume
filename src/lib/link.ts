export type State = {
  raw: string;
  theme: "light" | "dark";
  density: "minimal" | "medium" | "extra";
  mode?: "emoji" | "icon"; // back-compat only
};
import { compressToBase64, decompressFromBase64 } from "./lz";

// Encode state into a compact, URL-safe hash with a "z" prefix
export function stateToHash(s: State) {
  const payload = JSON.stringify(s);
  const b64 = compressToBase64(payload);
  // Make base64 URL-safe and drop padding
  const safe = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return "#z" + safe;
}

// Decode state supporting both URL-safe LZ base64 ("#z...") and legacy base64 JSON
export function hashToState(hash: string): State | null {
  if (!hash?.startsWith("#")) return null;
  const h = hash.slice(1);
  try {
    if (h.startsWith("z")) {
      // Convert URL-safe back to standard base64 and restore padding
      let data = h.slice(1).replace(/-/g, "+").replace(/_/g, "/");
      const pad = data.length % 4;
      if (pad === 2) data += "==";
      else if (pad === 3) data += "=";
      else if (pad === 1) return null; // invalid
      const json = decompressFromBase64(data);
      if (!json) return null;
      return JSON.parse(json) as State;
    }
    // Legacy: atob(base64) then decodeURIComponent
    const json = decodeURIComponent(atob(h));
    return JSON.parse(json) as State;
  } catch {
    return null;
  }
}
