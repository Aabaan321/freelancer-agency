export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: string;
  summary: string;
  tags: string[];
  year: number;
  gradient: string;
  challenge?: string;
  approach?: string;
  results?: { label: string; value: string }[];
  testimonial?: { quote: string; author: string; role: string };
  techStack?: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "nexora-ai-platform",
    title: "Nexora AI Platform",
    client: "Nexora Labs",
    category: "AI Product",
    summary: "End-to-end agentic platform shipped in 8 weeks. Voice + chat + workflow agents on a single console.",
    tags: ["AI", "Next.js", "Supabase"],
    year: 2025,
    gradient: "from-purple-500/20 via-gold/10 to-blue-500/20",
    challenge:
      "Nexora needed to consolidate three disconnected AI prototypes — a chatbot, an outbound voice agent, and an internal workflow runner — into a single product their enterprise clients could self-serve.",
    approach:
      "We rebuilt the agent runtime on a shared event log, standardized tool definitions, and wrapped everything in a console with project-level isolation, audit logs, and per-tenant billing.",
    results: [
      { label: "Time-to-launch", value: "8 weeks" },
      { label: "Active tenants", value: "12" },
      { label: "Avg. response p95", value: "1.2s" },
    ],
    testimonial: {
      quote: "Aureon delivered what a 12-person team couldn't ship in 6 months.",
      author: "Maya Saric",
      role: "CEO, Nexora Labs",
    },
    techStack: ["Next.js", "Supabase", "OpenAI", "Anthropic", "LiveKit", "Stripe"],
  },
  {
    slug: "helios-capital",
    title: "Helios Capital",
    client: "Helios Capital",
    category: "Brand + Web",
    summary: "Identity, design system, and marketing site for a sovereign-wealth advisory firm.",
    tags: ["Brand", "Web", "RTL"],
    year: 2025,
    gradient: "from-gold/20 via-amber-500/10 to-orange-500/20",
    challenge:
      "Helios was launching out of stealth with no brand and no marketing presence — and a press cycle starting in 14 days.",
    approach:
      "Identity, design system, copy, and a six-page marketing site in 14 days. Arabic + English from day one. Strict editorial visual language.",
    results: [
      { label: "Launch window", value: "14 days" },
      { label: "Pre-launch leads", value: "47" },
      { label: "Lighthouse", value: "98 / 100" },
    ],
    techStack: ["Next.js", "Sanity", "Framer Motion"],
  },
  {
    slug: "atlas-voyage",
    title: "Atlas Voyage",
    client: "Atlas Voyage",
    category: "E-commerce",
    summary: "Luxury travel booking experience with multi-currency pricing and concierge AI agent.",
    tags: ["E-com", "AI", "Multi-currency"],
    year: 2024,
    gradient: "from-emerald-500/20 via-gold/10 to-cyan-500/20",
    techStack: ["Next.js", "Stripe", "OpenAI"],
  },
  {
    slug: "mandara-studio",
    title: "Mandara Studio",
    client: "Mandara Studio",
    category: "Brand + Web",
    summary: "Editorial site for a high-end interior design studio. Animated case study library, RTL support.",
    tags: ["Editorial", "Motion", "CMS"],
    year: 2024,
    gradient: "from-rose-500/20 via-gold/10 to-amber-500/20",
    techStack: ["Next.js", "Sanity", "Framer Motion"],
  },
  {
    slug: "verita-health-agent",
    title: "Verita Health Agent",
    client: "Verita Health",
    category: "AI Product",
    summary: "Voice agent for inbound clinic calls. Handles triage, booking, and follow-ups in three languages.",
    tags: ["Voice AI", "Telephony", "Multilingual"],
    year: 2024,
    gradient: "from-blue-500/20 via-gold/10 to-violet-500/20",
    techStack: ["LiveKit", "OpenAI", "Twilio"],
  },
  {
    slug: "soraya-couture",
    title: "Soraya Couture",
    client: "Soraya Couture",
    category: "E-commerce",
    summary: "Bespoke commerce experience for a couture house. Made-to-order pipeline, atelier portal.",
    tags: ["E-com", "Atelier", "Concierge"],
    year: 2024,
    gradient: "from-fuchsia-500/20 via-gold/10 to-rose-500/20",
    techStack: ["Shopify", "Next.js", "Sanity"],
  },
];

export const CASE_CATEGORIES = ["All", "AI Product", "Brand + Web", "E-commerce"] as const;
