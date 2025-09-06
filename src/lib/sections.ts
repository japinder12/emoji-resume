export type Section =
  | "header"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "awards"
  | "contact"
  | "other";

const RX = {
  skills: /(skills?|tech( stack)?|tools?)\b/i,
  experience: /(experience|work|employment|intern(ship)?|company|engineer|developer)\b/i,
  projects: /(projects?|built|created|hackathon)\b/i,
  education: /(education|university|college|degree|gpa|b\.?\s?(a|s)\b|m\.?\s?s\b)/i,
  awards: /(awards?|honors?|scholarship|dean'?s list)/i,
  contact: /(email|@|github\.com|linkedin\.com|portfolio|website|https?:\/\/)/i,
  header: /(summary|profile|objective|—|–)/, // em/en dash or common header words
};

export function detectSection(line: string): Section {
  const l = line.trim();
  if (!l) return "other";
  if (RX.education.test(l)) return "education";
  if (RX.awards.test(l)) return "awards";
  if (RX.projects.test(l)) return "projects";
  if (RX.skills.test(l)) return "skills";
  if (RX.contact.test(l)) return "contact";
  if (RX.experience.test(l)) return "experience";
  if (RX.header.test(l)) return "header";
  return "other";
}

