/**
 * Single source of truth for business constants used across the marketing site.
 * Update here, propagates everywhere.
 */

export const SITE = {
  name: "Aureon Studio",
  tagline: "A boutique digital studio for ambitious brands.",
  description:
    "We build premium websites, AI-powered products, and brand systems for a hand-picked roster of clients each year. Considered design. Engineered with care.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://aureon.studio",
  email: "hello@aureon.studio",
  phone: "+971 54 339 7190",
  whatsapp: "+971543397190",
  location: "Dubai, UAE",
  social: {
    instagram: "https://instagram.com/aureon.studio",
    linkedin: "https://linkedin.com/company/aureon-studio",
    twitter: "https://twitter.com/aureonstudio",
  },
  business: {
    foundedYear: 2024,
    clientsCap: 5,
    spotsRemaining: 2,
  },
} as const;

export const TEAM = [
  {
    slug: "shubhan",
    name: "Shubhan",
    role: "CEO & Strategy",
    bio: "Shubhan sets the studio's direction. He pairs craft-led design instincts with hard commercial discipline, and personally owns every client relationship from first call to launch.",
    skills: ["Strategy", "Brand", "Product Direction", "Client Partnership"],
    image: "/team/shubhan.jpeg",
    linkedin: null,
  },
  {
    slug: "aabaan",
    name: "Aabaan",
    role: "CTO & AI",
    bio: "Aabaan leads engineering and AI. He has shipped agentic systems, voice agents, and bespoke automations for product teams across MENA — and ports the same rigor into every Aureon build.",
    skills: ["Full-stack", "AI / LLM", "Agentic systems", "Automation"],
    image: "/team/aabaan.jpeg",
    linkedin: "https://linkedin.com/in/aabaan",
  },
  {
    slug: "abhay",
    name: "Abhay",
    role: "CSO & Growth",
    bio: "Abhay turns finished work into momentum. He owns growth, performance marketing, and client onboarding — the bridge between great work and the audience it deserves.",
    skills: ["Growth", "Performance", "Sales", "Client Ops"],
    image: "/team/abhay.jpeg",
    linkedin: null,
  },
] as const;

export const PRICING_TIERS = [
  {
    slug: "starter",
    name: "Starter",
    price: 1000,
    currency: "AED",
    cadence: "one-time",
    headline: "Land your brand online, fast.",
    features: [
      "5-page custom website",
      "Mobile + responsive",
      "Basic SEO setup",
      "Contact form + analytics",
      "Launch in 7 days",
    ],
    featured: false,
  },
  {
    slug: "growth",
    name: "Growth",
    price: 2500,
    currency: "AED",
    cadence: "one-time",
    headline: "Premium build, full positioning.",
    features: [
      "Custom design system",
      "Up to 12 bespoke pages",
      "CMS + multi-language ready",
      "Performance + SEO tuning",
      "Animations + motion design",
      "30 days of post-launch support",
    ],
    featured: true,
  },
  {
    slug: "premium",
    name: "Premium",
    price: null,
    currency: "AED",
    cadence: "custom",
    headline: "AI products + complex builds.",
    features: [
      "AI agents + integrations",
      "Multi-currency + i18n",
      "Custom backend / portals",
      "Dedicated team",
      "Ongoing partnership",
      "Discovery workshop included",
    ],
    featured: false,
  },
] as const;

export const SERVICES = [
  {
    slug: "web-development",
    title: "Web Development",
    short: "Premium websites engineered for speed, accessibility, and conversion.",
    description:
      "Custom-built marketing sites, e-commerce, dashboards, and portals. Every line of code shipped by a senior engineer.",
    deliverables: ["Custom design system", "Multilingual + RTL ready", "Lighthouse 95+", "Headless CMS"],
    icon: "Code",
  },
  {
    slug: "ai-products",
    title: "AI Products",
    short: "Bespoke AI agents, automations, and assistants that ship to production.",
    description:
      "Voice agents, chatbots, autonomous workflows, RAG systems. Trained on your data, integrated into your stack.",
    deliverables: ["Custom GPT agents", "Voice + telephony agents", "RAG + knowledge base", "Workflow automation"],
    icon: "Sparkles",
  },
  {
    slug: "brand-design",
    title: "Brand & Design",
    short: "Identity, design systems, and product UI from a senior design team.",
    description:
      "Brand identity, visual systems, marketing collateral, and product design that pass the squint test.",
    deliverables: ["Identity systems", "Design systems", "Product UI/UX", "Pitch decks"],
    icon: "Palette",
  },
  {
    slug: "growth-marketing",
    title: "Growth Marketing",
    short: "Paid, organic, and lifecycle marketing built for compounding returns.",
    description:
      "Performance campaigns, SEO, content systems, and analytics — wired to your CRM and built to scale.",
    deliverables: ["Paid campaigns", "SEO + content", "Email + lifecycle", "Analytics + reporting"],
    icon: "TrendingUp",
  },
] as const;

export const PROCESS_STEPS = [
  { day: "Day 0", title: "Discovery call", body: "60 minutes. We listen, scope, and decide if we're the right fit." },
  { day: "Day 1–3", title: "Deep research", body: "Brand audit, competitive landscape, technical scope, success metrics." },
  { day: "Day 4–7", title: "Design sprint", body: "Wireframes, then high-fidelity. Reviewed live on a call, iterated same-week." },
  { day: "Day 8–15", title: "Build", body: "Engineering against a daily-updated checklist you see in your client portal." },
  { day: "Day 16–18", title: "QA + polish", body: "Cross-device, cross-browser. Performance, accessibility, copy, motion." },
  { day: "Day 19–21", title: "Launch + handoff", body: "Deploy, monitor, and a written + recorded walkthrough of everything." },
] as const;

export const LOCALES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
] as const;

export const CURRENCIES = [
  { code: "AED", symbol: "AED", label: "UAE Dirham" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "SAR", symbol: "SAR", label: "Saudi Riyal" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "PKR", symbol: "Rs", label: "Pakistani Rupee" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc" },
  { code: "CNY", symbol: "¥", label: "Chinese Yuan" },
  { code: "MYR", symbol: "RM", label: "Malaysian Ringgit" },
  { code: "KWD", symbol: "KWD", label: "Kuwaiti Dinar" },
] as const;
