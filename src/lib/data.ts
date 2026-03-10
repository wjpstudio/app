export type ProjectStatus =
  | "live"
  | "launching"
  | "building"
  | "planning"
  | "paused";

export interface Project {
  name: string;
  slug: string;
  description: string;
  status: ProjectStatus;
  url?: string;
  github?: string;
  stack?: string[];
}

export interface Agent {
  name: string;
  handle: string;
  role: string;
  title: string;
  pronouns: string;
  machine: string;
  model: string;
  description: string;
  owns: string;
  status: "active" | "standby" | "offline";
  skills: string[];
}

export const projects: Project[] = [
  {
    name: "For Crypto",
    slug: "forcrypto",
    description:
      "Marketplace for AI agents and creators to buy and sell digital products with crypto.",
    status: "launching",
    url: "https://forcrypto.market",
    github: "https://github.com/forcryptomarket",
    stack: ["React", "TanStack Start", "Bun", "Vercel", "Neon", "Solana"],
  },
  {
    name: "67",
    slug: "67",
    description: "Meme coin with memetic strategy. Culture is the product.",
    status: "building",
    github: "https://github.com/67community",
    stack: ["Solana", "Community", "Memetics"],
  },
  {
    name: "XES",
    slug: "xes",
    description:
      "AI-governed decentralized brand. Autonomous agents control treasury and direction.",
    status: "planning",
    github: "https://github.com/xescommunity",
    stack: ["Ethereum", "Governance", "Agent Swarm"],
  },
  {
    name: "Divvvy",
    slug: "divvvy",
    description: "Payment splitting for groups. Simple, fast, no friction.",
    status: "planning",
    github: "https://github.com/divvvycommunity",
  },
  {
    name: "Micro-Businesses",
    slug: "micro-businesses",
    description:
      "10 digital products for the AI economy. Frameworks, playbooks, toolkits. $29–49.",
    status: "launching",
  },
  {
    name: "Public Network",
    slug: "public-network",
    description: "Static site. Brand presence.",
    status: "live",
    url: "https://publicnetwork.com",
    github: "https://github.com/public-network",
  },
];

export const agents: Agent[] = [
  {
    name: "Kikai",
    handle: "kikaionchain",
    role: "operator",
    title: "Studio Operator",
    pronouns: "she/her",
    machine: "Mac Mini",
    model: "Opus",
    description:
      "WJP's right hand. Coordinates studio operations, reviews all agent work, runs morning briefs.",
    owns: "Cross-project coordination",
    status: "active",
    skills: [
      "Orchestration",
      "Agent monitoring",
      "Research",
      "Image generation",
      "Deployment",
      "Security",
    ],
  },
  {
    name: "Yama",
    handle: "yamaonchain",
    role: "grower",
    title: "Studio Grower",
    pronouns: "he/him",
    machine: "Mac Mini",
    model: "Sonnet",
    description:
      "Owns growth strategy, content, meme culture. Ships content autonomously with no review gate.",
    owns: "Content, growth, meme strategy",
    status: "active",
    skills: [
      "Content strategy",
      "Viral analysis",
      "Meme formats",
      "Competitor research",
      "Community growth",
    ],
  },
  {
    name: "Kodo",
    handle: "kodoonchain",
    role: "builder",
    title: "Studio Builder",
    pronouns: "she/her",
    machine: "Mac Mini",
    model: "Sonnet",
    description:
      "Owns code quality, audits, testing, QA. Builds studio tools and Mission Control.",
    owns: "QA, builds, dashboard",
    status: "active",
    skills: [
      "Code auditing",
      "QA testing",
      "Playwright automation",
      "Architecture docs",
      "Dashboard builds",
    ],
  },
  {
    name: "Claud",
    handle: "claude-code",
    role: "builder",
    title: "Production Builder",
    pronouns: "",
    machine: "WJP's Laptop",
    model: "Opus",
    description:
      "WJP's Claude Code. Writes and ships all production code. Fixes bugs, builds features, manages deployments.",
    owns: "Production code",
    status: "active",
    skills: [
      "Full-stack development",
      "Sub-agent delegation",
      "Architecture design",
      "Bug fixing",
      "Code review",
    ],
  },
];

export const statusColors: Record<ProjectStatus, string> = {
  live: "text-accent",
  launching: "text-foreground/60",
  building: "text-foreground/40",
  planning: "text-foreground/30",
  paused: "text-foreground/20",
};

export const statusDots: Record<ProjectStatus, string> = {
  live: "bg-accent",
  launching: "bg-foreground/60",
  building: "bg-foreground/40",
  planning: "bg-foreground/20",
  paused: "bg-foreground/10",
};

export const roleColors: Record<string, string> = {
  operator: "text-accent",
  grower: "text-foreground/70",
  builder: "text-foreground/50",
};
