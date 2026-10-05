/**
 * SINGLE SOURCE OF TRUTH for every piece of copy on the site.
 *
 * Every component imports its text from here, nothing is hardcoded in the
 * JSX. To update the site, edit only this file.
 *
 * Search this file for "PLACEHOLDER" (or run `grep -n PLACEHOLDER content/site.ts`)
 * to see every field that still needs real copy, a real number, or a real link.
 * The dummy copy reads like finished text on purpose; the comment above each field marks it.
 *
 * House rule: no em dashes in visible copy. Use a period, comma, colon or parentheses.
 */

export const media = {
  // Hero portrait (headshot1, cropped above the belt), background removed so the code symbols can sit behind and in front of you.
  portrait: "/images/v3/ali-portrait-1.webp",
  // The short silent loop of you working (cut from raw-assets/workingVid.mp4).
  video: "/video/at-work.mp4",
  videoPoster: "/images/v3/at-work-poster.jpg",
  // The AI twin's chat bubble: head and shoulders from raw-assets/ai-avatar.jpeg, background removed.
  avatar: "/images/v3/ai-twin-avatar.jpg",
  // Opens the Work section.
  desk: "/images/v3/at-desk.jpg",
};

export const personal = {
  name: "Ali Hassan",
  firstName: "Ali",
  role: "Software Engineer",
  tagline: "Software engineer building full-stack products, automations, and AI systems.",
  email: "alihassan060104@gmail.com",
  // PLACEHOLDER: confirm city/framing you want shown
  location: "Lahore, Pakistan",
  availability: "Available for new projects",
  // PLACEHOLDER: drop your CV into /public (for example /public/Ali-Hassan-CV.pdf) and put its path here.
  // While this is empty the "Download CV" buttons stay hidden.
  cv: "/Ali-Hassan-CV.pdf",
  // Shown as icons in the Contact section and the footer. Entries with an empty url are hidden.
  // `icon` must be one of: linkedin, x, instagram, github.
  social: [
    { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/ali-hassan-03b930224" },
    { label: "X", icon: "x", url: "https://x.com/alihassan23" },
    { label: "Instagram", icon: "instagram", url: "https://www.instagram.com/skibidi_hassan" },
    // PLACEHOLDER: add your GitHub profile URL
    { label: "GitHub", icon: "github", url: "" },
  ] as { label: string; icon: "linkedin" | "x" | "instagram" | "github"; url: string }[],
};

export const cta = {
  // Used everywhere: nav, hero, work, contact. Keep this one label consistent.
  label: "Start a Project",
  cv: "View Resume",
};

// The top navigation. `id` must match a section id below.
export const nav = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "experience", label: "Experience" },
];

export const hero = {
  greeting: "Hi, I'm Ali.",
  headline: "I build software that does real work.",
  // PLACEHOLDER: one or two sentences in your own voice
  sub: "Software engineer with over 3 years of experience. I design and ship full-stack web apps, automations, and AI systems, from the first sketch to the version people use every day.",
  workLink: "See my work",
  // Small tags that float in front of your portrait. Keep them short.
  chips: ["AI agents" , "Workflows", "Automations"],
};

export const about = {
  label: "About",
  heading: "Engineer by trade. Builder by habit.",
  // PLACEHOLDER: 2-4 short paragraphs, in your own voice
  paragraphs: [
    "I'm a software engineer at Cloudpacer in Lahore. Before that I spent a year freelancing, building products, automations, and AI systems for clients who needed something that worked, not a slide deck.",
    "I like the whole stack: the interface people touch, the logic behind it, and the quiet automations that save a team hours every week. Most of my days look like this clip.",
  ],
  facts: [
    { label: "Based in", value: "Lahore, Pakistan" },
    { label: "Right now", value: "Software Engineer at Cloudpacer" },
    { label: "Working since", value: "2023" },
    { label: "Focus", value: "Full-stack, AI systems, automation" },
  ],
  windowTitle: "ali@desk ~ %",
};

export type Service = {
  layer: string; // the small label on the stacked planes behind this section
  title: string;
  need: string; // the visitor's problem, in their words
  deliver: string; // what you build for it
};

export const servicesSection = {
  label: "Services",
  heading: "How I can help.",
  sub: "Four things I build. Most projects need more than one.",
};

// Listed top plane first.
export const services: Service[] = [
  {
    layer: "Interface",
    title: "Web Development",
    // PLACEHOLDER
    need: "You need a site or web app that's fast, looks the part, and turns visitors into customers.",
    deliver: "Full-stack websites and web apps in Next.js and React, built to last past launch day.",
  },
  {
    layer: "Logic",
    title: "Software Engineering",
    // PLACEHOLDER
    need: "You have a process that lives in spreadsheets and people's heads.",
    deliver: "Custom software, dashboards, and internal tools shaped around how your team actually works.",
  },
  {
    layer: "Flow",
    title: "Automation Systems",
    // PLACEHOLDER
    need: "Your team loses hours every week to copy, paste, and follow-up.",
    deliver: "Automations that connect your tools and run the repetitive work on their own.",
  },
  {
    layer: "Intelligence",
    title: "AI Systems",
    // PLACEHOLDER
    need: "You want AI doing real work in your business, not just a chat window.",
    deliver: "AI agents and LLM features wired into your data and workflows, with a human in the loop where it matters.",
  },
];

export const workSection = {
  label: "Selected work",
  heading: "Things I've built.",
  sub: "Five projects, from AI copilots to automations that run on their own.",
  closing: "Have something like this in mind?",
};

export type CaseStudy = {
  slug: string;
  name: string;
  kind: string; // short fact label shown above the name
  oneLiner: string;
  problem: string;
  approach: string;
  stack: string[];
  outcome: string;
  links: {
    live?: string;
    repo?: string;
  };
  image: string; // path under /public
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "azton",
    name: "Azton",
    kind: "Web app · AI agency",
    oneLiner: "A site for an AI agency with a built-in free audit that estimates the hours a business could win back.",
    // PLACEHOLDER
    problem: "Visitors couldn't tell which AI service fit their business before booking a call.",
    // PLACEHOLDER
    approach: "A self-serve audit, a five-question fit check, and service pages that explain each offer in plain terms.",
    // PLACEHOLDER: confirm the stack
    stack: ["Next.js", "Anthropic", "Vercel", "RAG"],
    // PLACEHOLDER
    outcome: "A first read in about ten minutes, with no sales call needed.",
    links: { live: "https://azton.vercel.app" },
    image: "/images/projects/azton.jpeg",
  },
  {
    slug: "autorad",
    name: "AutoRad",
    kind: "AI system · Healthcare",
    oneLiner: "An AI copilot that drafts structured chest X-ray reports for radiologists to review and sign.",
    // PLACEHOLDER
    problem: "Radiologists lose hours to repetitive report writing on routine scans.",
    // PLACEHOLDER
    approach: "The AI drafts Findings, Impression and Recommendations; a clinician always reviews and signs.",
    // PLACEHOLDER: confirm the stack
    stack: ["Next.js", "RAG", "LLM API", "Transformers", "CNNs"],
    // PLACEHOLDER
    outcome: "Faster reports, with a clinician in the loop on every one.",
    links: {},
    image: "/images/projects/autorad.jpeg",
  },
  {
    slug: "comsats-plus",
    name: "Comsats Plus",
    kind: "Web app · Education",
    // Details below are taken from the live site (comsatsplus.com); reword freely.
    oneLiner: "An installable campus companion for COMSATS University Lahore students.",
    problem: "Students hunted the campus for a free room and worked out their GPA by hand.",
    approach: "A free web app with four tools: a live room finder, a GPA and CGPA calculator, a campus memory map, and professor reviews.",
    // Read from the live site's code. PLACEHOLDER: add your database or backend if you want it shown.
    stack: ["Next.js", "Supabase", "PWA", "Vercel"],
    outcome: "8,000+ active users, the figure shown on the live site.",
    links: { live: "https://comsatsplus.com" },
    image: "/images/projects/comsats-plus-live.jpeg",
  },
  {
    slug: "seo-blog-automation",
    name: "SEO Engine",
    kind: "Automation · Content",
    oneLiner: "An AI pipeline that researches, writes, optimizes and publishes SEO blog content on its own.",
    // PLACEHOLDER
    problem: "A content team couldn't keep up with the research-to-publish cycle.",
    // PLACEHOLDER
    approach: "News monitoring, keyword strategy, AI drafting, metadata, FAQs and thumbnails, then auto-publish to the CMS.",
    // PLACEHOLDER: confirm the stack
    stack: ["n8n", "LLM API", "CMS", "Webhooks", "S3 Containers"],
    // PLACEHOLDER
    outcome: "Continuous content output with no manual steps.",
    links: {},
    image: "/images/projects/seo-blog-automation.jpeg",
  },
  {
    slug: "voice-agent",
    name: "Receptionist Voice Agent",
    kind: "AI agent · Scheduling",
    oneLiner: "An AI agent that books appointments end to end: availability, booking, confirmation.",
    // PLACEHOLDER
    problem: "Manual scheduling was eating hours every week.",
    // PLACEHOLDER
    approach: "A webhook-driven agent that checks the calendar, books or suggests times, updates records and confirms by email.",
    // PLACEHOLDER: confirm the stack
    stack: ["n8n", "OpenAI", "Google Calendar API"],
    // PLACEHOLDER
    outcome: "Routine bookings handled with nobody touching them.",
    links: {},
    image: "/images/projects/voice-agent.jpeg",
  },
];

export const process = {
  label: "Process",
  heading: "How I work.",
  sub: "The same four steps on every project, big or small.",
  // PLACEHOLDER: edit the wording of each step
  steps: [
    { title: "Understand", text: "We talk through the problem, the people it affects, and what done looks like." },
    { title: "Design", text: "I map the system and the screens before any code, so there are no surprises later." },
    { title: "Build", text: "Short cycles with working previews you can click, not status reports." },
    { title: "Ship", text: "Launch, hand-over, and support while it settles into real use." },
  ],
};

export type ExperienceEntry = {
  org: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  current?: boolean;
};

export const experienceSection = {
  label: "Experience",
  heading: "Where I've worked.",
  stackLabel: "Tools I use most",
};

export const experience: ExperienceEntry[] = [
  {
    org: "Cloudpacer",
    role: "Software Engineer",
    period: "June 2026 to present",
    location: "Lahore, Pakistan",
    // PLACEHOLDER
    summary: "One or two sentences on what you actually work on at Cloudpacer.",
    current: true,
  },
  {
    org: "Freelance",
    role: "Software Engineer (Full-Stack and AI)",
    period: "2024 to 2026",
    location: "Remote",
    // PLACEHOLDER
    summary: "Delivered full-stack products, automations, and AI systems for clients as an independent freelancer.",
  },
];

// PLACEHOLDER: confirm/edit this list
export const techStack: string[] = [
  "Next.js",
  "Claude",
  "TypeScript",
  "Python",
  "PostgreSQL",
  "n8n",
  "OpenAI",
  "LangChain",
  "Pinecone",
  "+"
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string; // their role and company
};

export const testimonialsSection = {
  label: "Kind words",
  heading: "What clients say.",
};

// PLACEHOLDER: add real client quotes here. The section stays hidden while this list is empty.
// Never add a made-up quote.
export const testimonials: Testimonial[] = [];

export const contact = {
  label: "Contact",
  heading: "Let's build something.",
  sub: "Tell me what you're building and where it's stuck. I reply within a day or two.",
  // PLACEHOLDER: confirm this is the inbox that should receive form submissions
  recipientEmail: "alihassan060104@gmail.com",
  emailLabel: "Or email me",
  fields: {
    name: "Name",
    email: "Email",
    projectType: "What are you building?",
    message: "Where is it stuck?",
  },
  sending: "Sending",
};

const aboutMe = "I am a software developer, I am 22 years old, I am skilled with AI systems, automations, and full stack development. I have worked on SaaS softwares and AI applications. I am open to work and help people develop their ideas. "