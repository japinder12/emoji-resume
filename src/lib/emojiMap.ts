export type Density = "minimal" | "medium" | "extra";
export type Section = import("./sections").Section;

type Entry = { kw: (string | RegExp)[]; emoji: string; sections?: Section[] };

export const EMOJI: Entry[] = [
  // Roles
  { kw: [/software engineer|developer|swe|backend|front[- ]?end|full[- ]?stack/], emoji: "🧑‍💻" },
  { kw: [/data scientist|ml engineer|ai|machine learning/], emoji: "🤖" },
  { kw: [/mobile|ios|android|flutter|react native/], emoji: "📱" },
  { kw: [/devops|sre|platform/], emoji: "🛠️" },
  { kw: [/security|infosec|appsec|iam/], emoji: "🛡️" },

  // Languages
  { kw: [/java\b/], emoji: "☕️" },
  { kw: [/kotlin\b/], emoji: "🟣" },
  { kw: [/\bpython\b/], emoji: "🐍" },
  { kw: [/typescript|javascript|\bts\b|\bjs\b/], emoji: "🟨" },
  { kw: [/\bc\+\+|cpp\b/], emoji: "➕➕" },
  { kw: [/\bgo\b|golang/], emoji: "🐹" },
  { kw: [/\brust\b/], emoji: "🦀" },
  { kw: [/\bruby\b/], emoji: "💎" },

  // Frameworks & FE
  { kw: [/react|next\.?js/], emoji: "⚛️" },
  { kw: [/vue|nuxt/], emoji: "🟩" },
  { kw: [/angular\b/], emoji: "🅰️" },
  { kw: [/spring( boot)?\b/], emoji: "🌱" },
  { kw: [/django|flask|fastapi/], emoji: "🧪" },

  // APIs & Back-end
  { kw: [/\bapi\b|rest|graphql|grpc/], emoji: "🔌" },
  { kw: [/microservices|service[- ]oriented/], emoji: "🧩" },

  // Data & DB
  { kw: [/sql|postgres|mysql|sqlite|mssql/], emoji: "🗄️" },
  { kw: [/mongodb|nosql|dynamo/], emoji: "🍃" },
  { kw: [/kafka|event|stream/], emoji: "🛰️" },
  { kw: [/spark|hadoop|big query|bigquery/], emoji: "🔥" },

  // Cloud & Infra
  { kw: [/aws|s3|ec2|lambda/], emoji: "☁️" },
  { kw: [/gcp|bigquery|cloud run/], emoji: "🌤️" },
  { kw: [/azure/], emoji: "🔷" },
  { kw: [/docker|container/], emoji: "🐳" },
  { kw: [/kubernetes|k8s/], emoji: "⛵️" },
  { kw: [/terraform|iac/], emoji: "🌍" },
  { kw: [/ci\/cd|github actions|pipeline/], emoji: "📦" },

  // Testing / Quality
  { kw: [/unit test|jest|pytest|cypress|integration test/], emoji: "✅" },
  { kw: [/performance|latency|throughput/], emoji: "⚡" },

  // Education & Achievements (section-aware)
  { kw: [/education|university|college|degree|b\.\s?(a|s)|m\.\s?s|gpa/], emoji: "🎓", sections: ["education"] },
  { kw: [/award|honor|scholarship|dean's list/], emoji: "🏆", sections: ["awards","education"] },

  // Soft skills / Ownership
  { kw: [/lead|mentor|ownership|initiative/], emoji: "🧭" },
  { kw: [/collaborat|team|cross[- ]functional/], emoji: "🤝" },
  { kw: [/communication|present|demo/], emoji: "🗣️" },

  // Projects / Impact
  { kw: [/project|built|implemented|designed/], emoji: "🛠️" },
  { kw: [/impact|saved|reduced|increased|improved|optimized/], emoji: "📈" },

  // Contact / Links (section-aware)
  { kw: [/email|contact/], emoji: "📬", sections: ["contact","header"] },
  { kw: [/github\.com|github\b/], emoji: "🐙", sections: ["contact","header","projects"] },
  { kw: [/linkedin\.com|linkedin\b/], emoji: "🔗", sections: ["contact","header"] },
  { kw: [/portfolio|website|www\.|https?:\/\//], emoji: "🌐", sections: ["contact","header"] },
];

export function mapLine(line: string, sec: Section, density: Density): string {
  const l = line.toLowerCase();
  const hits: string[] = [];
  for (const e of EMOJI) {
    if (e.sections && !e.sections.includes(sec)) continue;
    if (e.kw.some(k => (typeof k === "string" ? l.includes(k) : (k as RegExp).test(l)))) {
      hits.push(e.emoji);
    }
  }
  if (hits.length === 0) {
    if (sec === "experience") hits.push("🏢");
    else if (sec === "skills") hits.push("🧰");
    else if (sec === "projects") hits.push("🧪");
  }
  const cap = density === "minimal" ? 1 : density === "medium" ? 3 : 6;
  return Array.from(new Set(hits)).slice(0, cap).join(" ");
}
