/** Source: Aditya Kalsaria — resume, July 2025. */

export const PROFILE = {
  name: "Aditya Kalsaria",
  role: "UI/Brand Designer",
  email: "nvsadityakalsaria@gmail.com",
  x: "AdityaKalsaria",
  linkedin: "aditya-kalsaria",
  dribbble: "adi_kalsaria_",
};

export type Entry = {
  /** Start year — the grouping key in the tables. */
  year: string;
  title: string;
  /** Empty where the resume shows a logo rather than a name. */
  company: string;
  period: string;
  /** Human range shown in the timeline readout — authored, not derived, so
   *  it reads exactly as the resume does. `from`/`to` below are the tick
   *  bounds and are kept non-overlapping, which is not always the same span. */
  /** Inclusive month bounds, "YYYY-MM", driving which ticks belong to a role. */
  from?: string;
  to?: string;
  /** Path under /logos. Only set where the employer is confirmed. */
  logo?: string;
};

export const EXPERIENCE: Entry[] = [
  { year: "2025", title: "Product & Brand Designer", company: "KOSH", logo: "/logos/kosh.svg", period: "Sep 2025 — Now", from: "2025-09", to: "2026-08" },
  { year: "2025", title: "Senior UI/UX Designer", company: "BullX", logo: "/logos/bullx.svg", period: "Mar 2025 — Aug 2025", from: "2025-03", to: "2025-08" },
  { year: "2024", title: "Senior Brand & Product Designer", company: "Stackr", logo: "/logos/stackr.svg", period: "Oct 2024 — Feb 2025", from: "2024-10", to: "2025-02" },
  { year: "2023", title: "Lead Visual & Brand Designer", company: "Socket / Bungee", logo: "/logos/socket.svg", period: "Feb 2023 — Oct 2024", from: "2023-02", to: "2024-09" },
  { year: "2022", title: "UI Designer", company: "Polygon", logo: "/logos/polygon.png", period: "Aug 2022 — Feb 2023", from: "2022-08", to: "2023-01" },
  { year: "2021", title: "Visual Designer", company: "Polygon", logo: "/logos/polygon.png", period: "Sep 2021 — Aug 2022", from: "2021-09", to: "2022-07" },
  { year: "2020", title: "Visual Designer", company: "IconScout", logo: "/logos/iconscout.svg", period: "Sep 2020 — Sep 2021", from: "2020-09", to: "2021-08" },
  { year: "2019", title: "Design Generalist", company: "GeeksLab", logo: "/logos/geekslab.png", period: "Sep 2019 — Sep 2020", from: "2019-09", to: "2020-08" },
];

export const CLIENTS: Entry[] = [
  { year: "2025", title: "Dacoit.design", company: "UI design", period: "Jan — Jun" },
  { year: "2024", title: "BoomFi", company: "Visual design", period: "Jun — Now" },
  { year: "2024", title: "Flame.Live", company: "Visual design", period: "Nov — Feb 25" },
  { year: "2024", title: "Superfluid", company: "Visual design", period: "Jul — Jan 25" },
  { year: "2023", title: "Devfolio", company: "Visual / UI design", period: "Dec" },
  { year: "2022", title: "MahaDAO", company: "UI design", period: "Dec — Feb 23" },
  { year: "2022", title: "Infy Protocol", company: "Visual / UI design", period: "Aug — Oct" },
  { year: "2021", title: "Timeswap", company: "Visual design", period: "Apr — Sep" },
  { year: "2021", title: "Polytrade", company: "Illustration", period: "Apr — Jun" },
];

/** Consecutive entries sharing a year become one group, newest first. */
export function byYear(entries: Entry[]) {
  const groups: { name: string; items: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last?.name === entry.year) last.items.push(entry);
    else groups.push({ name: entry.year, items: [entry] });
  }
  return groups;
}

/** Inclusive list of "YYYY-MM" between two bounds. */
export function monthsBetween(from: string, to: string): string[] {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  const out: string[] = [];
  for (let y = fy, m = fm; y < ty || (y === ty && m <= tm); ) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) { m = 1; y += 1; }
  }
  return out;
}

export const TIMELINE_FROM = "2019-09";
export const TIMELINE_TO = "2026-08";
