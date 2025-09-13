export type State = {
  raw: string;
  theme: "light" | "dark";
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
      const obj = JSON.parse(json) as any;
      // Strip deprecated fields for forward-compat
      const { density: _d, mode: _m, ...rest } = obj || {};
      return rest as State;
    }
    // Legacy: atob(base64) then decodeURIComponent
    const json = decodeURIComponent(atob(h));
    const obj = JSON.parse(json) as any;
    const { density: _d, mode: _m, ...rest } = obj || {};
    return rest as State;
  } catch {
    return null;
  }
}
