// Map emoji tokens to terse monochrome "icons" (text codes)
// This reuses the emoji mapping output and renders readable short codes
export const EMOJI_TO_ICON: Record<string, string> = {
  "🧑‍💻": "ENG",
  "🤖": "AI",
  "📱": "MOB",
  "🛠️": "OPS",
  "🛡️": "SEC",
  "🎨": "UI",
  "📦": "CI",
  "📣": "REL",
  "📚": "R&D",
  "🚀": "ST",
  "🧑‍🎓": "INT",

  // Languages
  "☕️": "JAVA",
  "🧵": "KOT",
  "🐍": "PY",
  "📘": "TS",
  "✨": "JS",
  "➕➕": "C++",
  "🅲": "C",
  "🐹": "GO",
  "🦀": "RS",
  "💎": "RB",
  "🕊️": "SW",
  "🐘": "PHP",
  "📐": "SC",
  "🧠": "HS",
  "💧": "EX",
  "#️⃣": "NET",
  "📊": "R",

  // Frameworks / FE
  "⚛️": "RE",
  "🍃": "VUE",
  "🅰️": "NG",
  "🌱": "SPR",
  "🧪": "API",
  "🛣️": "EXP",
  "🧡": "SV",
  "🧊": "SOL",
  "🎛️": "RMX",
  "🚆": "RL",
  "📜": "LAR",
  "✨ ": "BUND",

  // Data / DB
  "🗄️": "SQL",
  "🔍": "ES",
  "🧱": "RED",
  "🛰️": "KFK",
  "🔥": "BD",
  "❄️": "SNOW",

  // Cloud & Infra
  "☁️": "AWS",
  "🌤️": "GCP",
  "🔷": "AZ",
  "🐳": "DKR",
  "⛵️": "K8S",
  "🌍": "TF",
  "🖥️": "OS",

  // Contact / misc
  "📬": "MAIL",
  "📞": "PH",
  "🐙": "GH",
  "🔗": "LI",
  "🌐": "WEB",
  "🏗️": "PRJ",
  "📈": "IM",
  "🧾": "LOG",
  "🏛️": "GOV",
  "🎓": "EDU",
  "❤️": "VOL",
  "🤝": "TEAM",
};

export function toIconText(emojiText: string): string {
  return emojiText
    .split("\n")
    .map(line => line
      .split(/\s+/)
      .filter(Boolean)
      .map(tok => EMOJI_TO_ICON[tok] || "·")
      .join(" ")
    )
    .join("\n");
}

