import { CATEGORIES, leadProject } from "@/lib/work";
import RowTable, { type TableGroup } from "./RowTable";

/** Where the landing page designs live. */
const LANDING_FIGMA =
  "https://www.figma.com/design/2uxNowDpuoAZlWrSe563po/Landing-page-designs?node-id=1-136932";

/** A clip that plays when the landing page pill is hovered: the label inflating
 *  into glossy letters. Put pill.webm and pill.mp4 in /public/pill and set this
 *  to "/pill/pill". Until then the pill only leans and pops. */
const PILL_CLIP: string | undefined = undefined;

/**
 * Work is one row per category, not per project. A category opens on its most
 * recent piece and the rest are reachable from the rail there, which keeps
 * this list to a line per category however much work sits behind it.
 */
export default function WorkList() {
  // One entry per category. Empty ones stay listed but unlinked, so the shape
  // of the work is visible before every category has something in it.
  const groups: TableGroup[] = [
    {
      name: "",
      items: [
        ...CATEGORIES.map((c) => {
          const lead = leadProject(c);
          return {
            key: c.id,
            title: c.name,
            href: lead ? `/work/${lead.slug}` : undefined,
            quiet: !lead,
          };
        }),
        {
          key: "landing-page",
          title: "Landing page",
          href: LANDING_FIGMA,
          external: true,
          pill: "Check in Figma",
          pillVideo: PILL_CLIP,
        },
      ],
    },
  ];

  return <RowTable label="Work" groups={groups} flat />;
}
