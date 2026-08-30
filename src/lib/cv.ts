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
  /** Start year — the grouping key in the timeline. */
  year: string;
  title: string;
  /** Empty where the resume shows a logo rather than a name. */
  company: string;
  period: string;
};

export const EXPERIENCE: Entry[] = [
  { year: "2025", title: "Product & Brand Designer", company: "KOSH", period: "Sep — Now" },
  { year: "2025", title: "Senior UI/UX Designer", company: "", period: "Mar — Aug" },
  { year: "2024", title: "Senior Brand & Product Designer", company: "", period: "Oct — Feb 25" },
  { year: "2023", title: "Lead Visual & Brand Designer", company: "", period: "Feb — Oct 24" },
  { year: "2022", title: "UI Designer", company: "", period: "Aug — Feb 23" },
  { year: "2021", title: "Visual Designer", company: "", period: "Sep — Aug 22" },
  { year: "2020", title: "Visual Designer / Design Generalist", company: "", period: "Sep — Sep 21" },
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
