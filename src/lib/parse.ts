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

  return t.split(/\n/).map(s => s.trim()).filter(Boolean);
}

export function toEmojiCardFromLines(lines: string[], density: Density) {
  // Preserve 1:1 alignment: one emoji row per input line
  // Do not filter out empty results; empty strings keep blank lines
  const rows = lines.map(line => mapLine(line, detectSection(line), density));
  // Reduce repetition globally across rows
  const counts = new Map<string, number>();
  const limitFor = (emoji: string) => {
    // Allow more repeats on higher densities
    const base = density === "minimal" ? 2 : density === "medium" ? 3 : 4;
    return emoji === "🧑‍💻" ? 1 : base;
  };
  const filtered = rows.map(row => {
    if (!row) return row;
    const out: string[] = [];
    for (const t of row.split(/\s+/).filter(Boolean)) {
      const n = counts.get(t) ?? 0;
      const lim = limitFor(t);
      if (n < lim) {
        out.push(t);
        counts.set(t, n + 1);
      }
    }
    return out.join(" ");
  });
  if (filtered.every(r => !r)) return "";
  return filtered.join("\n");
}
