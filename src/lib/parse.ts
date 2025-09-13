/* eslint-disable no-useless-escape */ // regex-heavy file; escapes intentional for readability
import { detectSection } from "./sections";
import { mapLine, type Density } from "./emojiMap";

export function toLines(text: string): string[] {
  // Normalize line endings
  let t = text.replace(/\r\n?/g, "\n");
  const existingLines = (t.match(/\n/g) || []).length;

  // Heuristics for near-single-line input
  if (existingLines < 3) {
    // Break on common inline separators
    t = t
      .replace(/\s*[•·]\s*/g, "\n") // bullets
      .replace(/\s*\|\s*/g, "\n") // pipes
      .replace(/;\s+/g, "\n") // semicolons
      .replace(/\s{2,}/g, " "); // collapse large gaps

    // Insert newlines before common section headers/keywords
    const heads = [
      "Education", "Experience", "Projects", "Skills", "Technical Skills",
      "Certifications", "Awards", "Coursework", "Tools", "Languages",
      "Frameworks", "Libraries", "Databases", "Contact", "Summary", "Objective"
    ];
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(`(?<!\n)(?:^|\s)(${heads.map(esc).join("|")})\b`, "g");
    t = t.replace(rx, (_, g1) => `\n${g1}`);

    // Split on colons denoting labeled fields (e.g., "Coursework:")
    t = t.replace(/\b([A-Z][A-Za-z\s\/&]+):\s*/g, "\n$1: ");
  }

  const arr = t
    .split(/\n/)
    .map(s => s.trim())
    .filter(Boolean)
    // Drop one-word lines unless they look like valid section headers/contact
    .filter((s) => {
      const words = s.split(/\s+/).filter(Boolean);
      if (words.length <= 1) {
        const sec = detectSection(s);
        return sec !== "other"; // keep recognized headers/contact
      }
      return true;
    });
  return arr;
}

export function toEmojiCardFromLines(lines: string[], density: Density) {
  // Map each input line to emojis
  const mapped = lines.map(line => ({
    sec: detectSection(line),
    row: mapLine(line, detectSection(line), density),
  })).filter(x => Boolean(x.row));

  // Global repetition cap to avoid spam across the whole card
  const counts = new Map<string, number>();
  const limitFor = (emoji: string) => (emoji === "🧑‍💻" ? 1 : density === "minimal" ? 2 : density === "medium" ? 3 : 4);

  // Helper: admit token if under global cap
  const admit = (t: string) => {
    const n = counts.get(t) ?? 0;
    const lim = limitFor(t);
    if (n < lim) { counts.set(t, n + 1); return true; }
    return false;
  };

  const perRow = density === "minimal" ? 4 : density === "medium" ? 6 : 8;
  const out: string[] = [];
  let singles: string[] = [];
  const pinnedSingles: string[] = [];
  const pinnedSections = new Set(["header"]);
  let lastSec: ReturnType<typeof detectSection> | null = null;

  const flushSingles = () => {
    while (singles.length >= perRow) {
      out.push(singles.splice(0, perRow).join(" "));
    }
    if (singles.length) {
      out.push(singles.join(" "));
      singles = [];
    }
  };

  for (const { sec, row } of mapped) {
    const tokens = row.split(/\s+/).filter(Boolean).filter(admit);
    if (tokens.length === 0) continue;

    // If section changes, keep layout tidy by flushing singles so far
    if (lastSec !== null && lastSec !== sec && singles.length) flushSingles();
    lastSec = sec;

    if (tokens.length === 1) {
      const t = tokens[0];
      if (pinnedSections.has(sec)) {
        // Prefer placing header/education singles at the very top
        pinnedSingles.push(t);
      } else {
        // Accumulate only until a boundary; flush nearby rather than at the end
        singles.push(t);
        if (singles.length >= perRow) {
          out.push(singles.splice(0, perRow).join(" "));
        }
      }
    } else if (tokens.length > perRow) {
      flushSingles();
      for (let i = 0; i < tokens.length; i += perRow) {
        out.push(tokens.slice(i, i + perRow).join(" "));
      }
    } else {
      flushSingles();
      out.push(tokens.join(" "));
    }
  }

  flushSingles();
  // Prepend pinned singles (chunked) so they land at the top
  const pre: string[] = [];
  let ps = [...pinnedSingles];
  while (ps.length >= perRow) pre.push(ps.splice(0, perRow).join(" "));
  if (ps.length) pre.push(ps.join(" "));
  return [...pre, ...out].join("\n");
}
