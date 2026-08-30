/** Source: Aditya Kalsaria — resume, July 2025. */

export const PROFILE = {
  name: "Aditya Kalsaria",
  role: "UI/Brand Designer",
  email: "nvsadityakalsaria@gmail.com",
  phone: "+91 90163 37977",
  x: "AdityaKalsaria",
  linkedin: "aditya-kalsaria",
  github: "Adityakalsaria",
  dribbble: "adi_kalsaria_",
};

export type Role = {
  title: string;
  /** Empty where the resume shows a logo rather than a name. */
  company: string;
  period: string;
  notes: string[];
};

export const EXPERIENCE: Role[] = [
  {
    title: "Product & Brand Designer",
    company: "KOSH (prev. Copperx)",
    period: "Sep 2025 — Current",
    notes: [
      "Wireframes through dev-ready UI for the exchange and its features.",
      "New screens and app flows for the KOSH mobile app.",
      "Rebranded Copperx to KOSH — a sharper identity for a serious financial tool.",
      "End-to-end campaign design with the marketing team.",
    ],
  },
  {
    title: "Senior UI/UX Designer",
    company: "",
    period: "Mar 2025 — Aug 2025",
    notes: [
      "Wireframes through dev-ready UI across the exchange.",
      "Three new product pages: leaderboard, market view, and a 360 analysis product.",
      "Sitemaps and product flows for the full feature set.",
    ],
  },
  {
    title: "Senior Brand & Product Designer",
    company: "",
    period: "Oct 2024 — Feb 2025",
    notes: [],
  },
  {
    title: "Lead Visual & Brand Designer",
    company: "",
    period: "Feb 2023 — Oct 2024",
    notes: [
      "Led campaigns, promo videos, metrics graphics and explainer videos.",
      "Brand refresh of Bungee protocol — logo, palette, and the background forms.",
      "Brand guidelines for both product and marketing.",
      "2D animation and micro-interactions for icons and illustrations.",
    ],
  },
  {
    title: "UI Designer",
    company: "",
    period: "Aug 2022 — Feb 2023",
    notes: [
      "Polygon wallet suite homepage and helpdesk rebranding.",
      "Contributed to the rebrand of the wallet suite and its design system.",
      "Built a small design system for design QA.",
    ],
  },
  {
    title: "Visual Designer",
    company: "",
    period: "Sep 2021 — Aug 2022",
    notes: [
      "Campaign visuals including BuidlIT 2022, Polygon Guilds, Nightfall, Ignite, Jampad and Connect.",
      "Product illustrations, icons and short animations across the brand.",
    ],
  },
  {
    title: "Visual Designer / Design Generalist",
    company: "",
    period: "Sep 2020 — Sep 2021",
    notes: [
      "Animated 2D/3D launch videos, blog banners and social campaigns.",
      "Worked alongside 3D designers, animators and illustrators to keep the brand consistent.",
    ],
  },
];

export type Client = { name: string; role: string; period: string };

export const CLIENTS: Client[] = [
  { name: "BoomFi", role: "Visual designer", period: "Jun 2024 — Current" },
  { name: "Dacoit.design", role: "UI designer", period: "Jan 2025 — Jun 2025" },
  { name: "Flame.Live", role: "Visual designer", period: "Nov 2024 — Feb 2025" },
  { name: "Superfluid", role: "Visual designer", period: "Jul 2024 — Jan 2025" },
  { name: "Devfolio", role: "Visual / UI designer", period: "Dec 2023" },
  { name: "MahaDAO", role: "UI designer", period: "Dec 2022 — Feb 2023" },
  { name: "Infy Protocol", role: "Visual / UI designer", period: "Aug 2022 — Oct 2022" },
  { name: "Timeswap", role: "Visual designer", period: "Apr 2021 — Sep 2021" },
  { name: "Polytrade", role: "Illustration designer", period: "Apr 2021 — Jun 2021" },
];

export const EDUCATION = {
  school: "Bhagwan Mahavir University, Surat",
  degree: "BSc Biotechnology",
  period: "2018 — 2021",
};

export const TOOLS = [
  "Figma", "Illustrator", "Photoshop", "After Effects",
  "Premiere Pro", "Blender", "Sketch", "Adobe XD",
];
