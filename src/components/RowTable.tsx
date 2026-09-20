"use client";

import Link from "next/link";
import { clsx } from "clsx";
import PuffPill from "./PuffPill";

export type TableItem = {
  key: string;
  title: string;
  meta?: string;
  /** A small label in the meta column, in place of the text. */
  pill?: string;
  /** A clip to play in place of the linked pill on hover; see PuffPill. */
  pillVideo?: string;
  href?: string;
  /** Open href in a new tab, for a link that leaves the site. */
  external?: boolean;
  /** Rendered greyed, for rows that are placeholders rather than entries. */
  quiet?: boolean;
};

export type TableGroup = {
  name: string;
  items: TableItem[];
};

type Props = {
  label: string;
  groups: TableGroup[];
  /** Called with an item key and its row element on enter, null on leave. */
  onActive?: (key: string | null, row?: HTMLElement) => void;
  /** Drop the group gutter, for a table whose rows need no grouping. */
  flat?: boolean;
};

/**
 * The rules encode the grouping:
 *   - under the section label, and between groups → full width
 *   - between rows inside a group             → start at the title column
 *   - after the last row                      → none
 * so the eye can find a group boundary without the group name being repeated.
 */
export default function RowTable({ label, groups, onActive, flat }: Props) {
  const rows = groups.flatMap((group, gi) =>
    group.items.map((item, ii) => ({
      ...item,
      group: ii === 0 ? group.name : "",
      // The first row of the table sits under the label's own rule.
      rule: ii === 0 ? (gi === 0 ? "none" : "full") : "indent",
    }))
  );

  return (
    <div className={flat ? "table is-flat" : "table"}>
      <p className="table-label">{label}</p>

      {rows.map((row) => {
        const cells = (
          <>
            {!flat && (
              <span className={clsx("cell", "cell-group", `rule-${row.rule}`)}>
                {row.group}
              </span>
            )}
            <span
              className={clsx(
                "cell",
                "cell-title",
                row.rule === "none" ? "rule-none" : "rule-on",
                row.quiet && "sub"
              )}
            >
              {row.href ? <span className="link">{row.title}</span> : row.title}
            </span>
            <span
              className={clsx(
                "cell",
                "cell-meta",
                row.rule === "none" ? "rule-none" : "rule-on"
              )}
            >
              {row.pill ? <PuffPill label={row.pill} video={row.pillVideo} /> : row.meta}
            </span>
          </>
        );

        const hover = {
          onPointerEnter: (e: React.PointerEvent<HTMLElement>) => onActive?.(row.key, e.currentTarget),
          onPointerLeave: () => onActive?.(null),
          onFocus: (e: React.FocusEvent<HTMLElement>) => onActive?.(row.key, e.currentTarget),
          onBlur: () => onActive?.(null),
        };

        return row.href ? (
          row.external ? (
            <a
              key={row.key}
              href={row.href}
              target="_blank"
              rel="noreferrer"
              className="trow"
              {...hover}
            >
              {cells}
            </a>
          ) : (
            <Link key={row.key} href={row.href} className="trow" {...hover}>
              {cells}
            </Link>
          )
        ) : (
          <div key={row.key} className="trow">
            {cells}
          </div>
        );
      })}
    </div>
  );
}
