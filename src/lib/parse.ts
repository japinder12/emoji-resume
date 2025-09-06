import { detectSection } from "./sections";
import { mapLine, type Density } from "./emojiMap";

export function toLines(text: string): string[] {
  return text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}

export function toEmojiCardFromLines(lines: string[], density: Density) {
  // Map each line independently first
  const perLine = lines
    .map(line => mapLine(line, detectSection(line), density))
    .filter(Boolean);

  // Enforce a global cap: any given emoji appears at most N times
  const counts = new Map<string, number>();
  const caps = new Map<string, number>([["🧑‍💻", 2]]); // reduce repetition of the laptop emoji
  const cappedLines: string[] = [];
  for (const row of perLine) {
    const tokens = row.split(/\s+/).filter(Boolean);
    const kept: string[] = [];
    for (const t of tokens) {
      const n = counts.get(t) ?? 0;
      const limit = caps.get(t) ?? 3;
      if (n < limit) {
        kept.push(t);
        counts.set(t, n + 1);
      }
    }
    if (kept.length) cappedLines.push(kept.join(" "));
  }
  const header = "👋🧑‍💻";
  const footer = "📬 🔗 🐙 🌐";
  return [header, ...cappedLines, footer].join("\n");
}
