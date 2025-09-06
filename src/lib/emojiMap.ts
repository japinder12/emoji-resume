export type Density = "minimal" | "medium" | "extra";
import type { Section } from "./sections";

type Entry = { kw: (string | RegExp)[]; emoji: string; sections?: Section[] };

export const EMOJI: Entry[] = [
  // Roles
  { kw: [/software engineer|developer|swe|backend|back[- ]?end|front[- ]?end|full[- ]?stack|engineer\b|engineering/], emoji: "🧑‍💻" },
  { kw: [/data scientist|ml engineer|ai|machine learning/], emoji: "🤖" },
  { kw: [/mobile|ios|android|flutter|react native/], emoji: "📱" },
  { kw: [/devops|sre|platform/], emoji: "🛠️" },
  { kw: [/security|infosec|appsec|iam/], emoji: "🛡️" },
  { kw: [/designer|ui\/ux|product design/], emoji: "🎨" },
  { kw: [/product manager|pm|product management/], emoji: "📦" },
  { kw: [/developer relations|devrel|advocate/], emoji: "📣" },
  { kw: [/research|phd|paper|publication/], emoji: "📚" },
  { kw: [/founder|co[- ]?founder|entrepreneur|startup/], emoji: "🚀" },
  { kw: [/intern\b|internship/], emoji: "🧑‍🎓" },

  // Languages
  { kw: [/java\b/], emoji: "☕️" },
  { kw: [/kotlin\b/], emoji: "🟣" },
  { kw: [/\bpython\b/], emoji: "🐍" },
  { kw: [/typescript|javascript|\bts\b|\bjs\b/], emoji: "🟨" },
  { kw: [/\bc\+\+|cpp\b/], emoji: "➕➕" },
  { kw: [/\bgo\b|golang/], emoji: "🐹" },
  { kw: [/\brust\b/], emoji: "🦀" },
  { kw: [/\bruby\b/], emoji: "💎" },
  { kw: [/swift\b/], emoji: "🕊️" },
  { kw: [/php\b/], emoji: "🐘" },
  { kw: [/scala\b/], emoji: "🟥" },
  { kw: [/haskell\b/], emoji: "🟪" },
  { kw: [/elixir\b/], emoji: "💧" },
  { kw: [/\.net|c#|dotnet/], emoji: "#️⃣" },
  { kw: [/\bc\b(?!\+\+)/], emoji: "🅲" },
  { kw: [/r\b(?!ust)/], emoji: "📊" },
  { kw: [/julia\b/], emoji: "🟣🟢" },
  { kw: [/matlab\b/], emoji: "📐" },
  { kw: [/bash|shell|zsh/], emoji: "🐚" },
  { kw: [/node(\.js)?\b|deno\b|bun\b/], emoji: "🟩" },

  // Frameworks & FE
  { kw: [/react|next\.?js|react hooks/], emoji: "⚛️" },
  { kw: [/vue|nuxt/], emoji: "🟩" },
  { kw: [/angular\b/], emoji: "🅰️" },
  { kw: [/spring( boot)?\b/], emoji: "🌱" },
  { kw: [/django|flask|fastapi/], emoji: "🧪" },
  { kw: [/express\b|koa\b|hapi\b|nest(js)?\b/], emoji: "🧭" },
  { kw: [/svelte|sveltekit/], emoji: "🧡" },
  { kw: [/solid(js)?/], emoji: "🟦" },
  { kw: [/remix\b/], emoji: "🎛️" },
  { kw: [/astro\b/], emoji: "✨" },
  { kw: [/rails\b/], emoji: "🚆" },
  { kw: [/laravel\b/], emoji: "🟥" },
  { kw: [/webpack|rollup|vite|esbuild|parcel/], emoji: "📦" },
  { kw: [/tailwind|css|sass|less/], emoji: "🎨" },

  // APIs & Back-end
  { kw: [/\bapi\b|rest\b|graphql|grpc/], emoji: "🔌" },
  { kw: [/microservices|service[- ]oriented/], emoji: "🧩" },
  { kw: [/monolith\b|soa\b/], emoji: "🏛️" },
  { kw: [/auth(entication)?|authorization|oauth|jwt|sso|openid|auth0|okta/], emoji: "🔐" },
  { kw: [/websocket|sse|socket\.io/], emoji: "🗣️" },
  { kw: [/caching|cache|cdn|cloudfront|varnish|fastly/], emoji: "🧊" },

  // Data & DB
  { kw: [/sql|postgres|mysql|sqlite|mssql/], emoji: "🗄️" },
  { kw: [/mongodb|nosql|dynamo/], emoji: "🍃" },
  { kw: [/kafka|event|stream/], emoji: "🛰️" },
  { kw: [/spark|hadoop|big query|bigquery/], emoji: "🔥" },
  { kw: [/redis\b/], emoji: "🟥" },
  { kw: [/elasticsearch|elastic/], emoji: "🔍" },
  { kw: [/neo4j|graph db/], emoji: "🕸️" },
  { kw: [/snowflake\b|redshift\b|bigquery\b/], emoji: "❄️" },
  { kw: [/databricks\b|lakehouse/], emoji: "🏞️" },
  { kw: [/airflow\b|dagster\b|prefect\b/], emoji: "🪂" },
  { kw: [/etl\b|elt\b|pipeline/], emoji: "🧵" },

  // Cloud & Infra
  { kw: [/aws|s3|ec2|lambda/], emoji: "☁️" },
  { kw: [/gcp|bigquery|cloud run/], emoji: "🌤️" },
  { kw: [/azure/], emoji: "🔷" },
  { kw: [/docker|container/], emoji: "🐳" },
  { kw: [/kubernetes|k8s/], emoji: "⛵️" },
  { kw: [/terraform|iac/], emoji: "🌍" },
  { kw: [/ci\/cd|github actions|pipeline/], emoji: "📦" },
  { kw: [/linux|unix|macos|windows/], emoji: "🖥️" },
  { kw: [/ansible|chef|puppet/], emoji: "🧑‍🍳" },
  { kw: [/nginx|apache\b|traefik/], emoji: "🧭" },
  { kw: [/prometheus|grafana|datadog|new relic|sentry|opentelemetry|otel/], emoji: "📈" },
  { kw: [/logging|logstash|loki\b/], emoji: "🧾" },
  { kw: [/message queue|mq\b|rabbitmq|sqs|sns|pub\/sub|pubsub/], emoji: "📮" },

  // Testing / Quality
  { kw: [/unit test|jest|pytest|cypress|playwright|integration test/], emoji: "✅" },
  { kw: [/performance|latency|throughput/], emoji: "⚡" },
  { kw: [/lint|eslint|prettier|static analysis/], emoji: "🧹" },
  { kw: [/feature flag|launchdarkly|split\.io/], emoji: "🚩" },

  // Education & Achievements (section-aware)
  { kw: [/education|university|college|degree|b\.\s?(a|s)|m\.\s?s|gpa/], emoji: "🎓", sections: ["education"] },
  { kw: [/award|honor|scholarship|dean's list/], emoji: "🏆", sections: ["awards","education"] },

  // Soft skills / Ownership
  { kw: [/lead|mentor|ownership|initiative/], emoji: "🧭" },
  { kw: [/collaborat|team|cross[- ]functional/], emoji: "🤝" },
  { kw: [/communication|present|demo/], emoji: "🗣️" },
  { kw: [/accessib|a11y|inclusive/], emoji: "♿" },
  { kw: [/community|volunteer/], emoji: "❤️" },
  { kw: [/documentation|docs|readme/], emoji: "📄" },
  { kw: [/ownership|accountab|on[- ]call|pagerduty/], emoji: "📟" },

  // Projects / Impact
  { kw: [/project|built|implemented|designed/], emoji: "🛠️" },
  { kw: [/impact|saved|reduced|increased|improved|optimized|grew|cut|boosted/], emoji: "📈" },
  { kw: [/reliab|uptime|sla/], emoji: "🧱" },
  { kw: [/scalab|scale|horiz(ontal)? scaling|vertical scaling/], emoji: "📐" },

  // Contact / Links (section-aware)
  { kw: [/email|contact/], emoji: "📬", sections: ["contact","header"] },
  { kw: [/github\.com|github\b/], emoji: "🐙", sections: ["contact","header","projects"] },
  { kw: [/linkedin\.com|linkedin\b/], emoji: "🔗", sections: ["contact","header"] },
  { kw: [/portfolio|website|www\.|https?:\/\//], emoji: "🌐", sections: ["contact","header"] },

  // Domains / Industries
  { kw: [/fintech|payments|bank|trading|defi/], emoji: "💸" },
  { kw: [/healthcare|med|clinic|hipaa/], emoji: "🏥" },
  { kw: [/e[- ]?commerce|shopify|storefront/], emoji: "🛒" },
  { kw: [/gaming|game dev|unity|unreal/], emoji: "🎮" },
  { kw: [/maps|geospat|gis|geocod/], emoji: "🗺️" },
  { kw: [/media|video|streaming|vod/], emoji: "🎬" },
  { kw: [/iot|embedded|firmware/], emoji: "📟" },
  { kw: [/robotics/], emoji: "🤖" },
  { kw: [/edtech|education tech/], emoji: "🧪" },
  { kw: [/ads|advertising|adtech|campaign/], emoji: "📣" },
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
