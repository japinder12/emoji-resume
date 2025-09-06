import { detectSection } from "./sections";
import { mapLine, type Density } from "./emojiMap";

export function toLines(text: string): string[] {
  return text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}

export function toEmojiCardFromLines(lines: string[], density: Density) {
  const emojiLines = lines
    .map(line => mapLine(line, detectSection(line), density))
    .filter(Boolean);
  const header = "👋🧑‍💻";
  const footer = "📬 🔗 🐙 🌐";
  return [header, ...emojiLines, footer].join("\n");
}
