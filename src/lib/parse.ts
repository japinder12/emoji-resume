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
  // Map each line to emojis first
  const perLine = lines
    .map(line => mapLine(line, detectSection(line), density))
    .filter(Boolean);

  // Global cap per emoji and flatten
  const counts = new Map<string, number>();
  const caps = new Map<string, number>([["🧑‍💻", 2]]); // reduce repetition of the laptop emoji
  const allTokens: string[] = [];
  for (const row of perLine) {
    for (const t of row.split(/\s+/).filter(Boolean)) {
      const n = counts.get(t) ?? 0;
      const limit = caps.get(t) ?? 3;
      if (n < limit) {
        allTokens.push(t);
        counts.set(t, n + 1);
      }
    }
  }

  // If none detected, return empty (UI shows placeholder)
  if (allTokens.length === 0) {
    return "";
  }

  // Chunk tokens into balanced rows
  const perRow = density === "minimal" ? 4 : density === "medium" ? 6 : 8;
  const rows: string[] = [];
  let buf: string[] = [];
  for (const t of allTokens) {
    buf.push(t);
    if (buf.length >= perRow) {
      rows.push(buf.join(" "));
      buf = [];
    }
  }
  if (buf.length) rows.push(buf.join(" "));

  const header = "👋🧑‍💻";
  const footer = "💼";
  return [header, ...rows, footer].join("\n");
}
