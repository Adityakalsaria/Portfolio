"use client";

import Link from "next/link";
import { clsx } from "clsx";

export type TableItem = {
  key: string;
  title: string;
  meta?: string;
  href?: string;
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
  /** Called with an item key on pointer enter, null on leave. */
  onActive?: (key: string | null) => void;
};

/**
 * The rules encode the grouping:
 *   - under the section label, and between groups → full width
 *   - between rows inside a group             → start at the title column
 *   - after the last row                      → none
 * so the eye can find a group boundary without the group name being repeated.
 */
export default function RowTable({ label, groups, onActive }: Props) {
  const rows = groups.flatMap((group, gi) =>
    group.items.map((item, ii) => ({
      ...item,
      group: ii === 0 ? group.name : "",
      // The first row of the table sits under the label's own rule.
      rule: ii === 0 ? (gi === 0 ? "none" : "full") : "indent",
    }))
  );

  return (
    <div className="table">
      <p className="table-label">{label}</p>

      {rows.map((row) => {
        const cells = (
          <>
            <span className={clsx("cell", "cell-group", `rule-${row.rule}`)}>
              {row.group}
            </span>
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
              {row.meta}
            </span>
          </>
        );

        return row.href ? (
          <Link
            key={row.key}
            href={row.href}
            className="trow"
            onPointerEnter={() => onActive?.(row.key)}
            onPointerLeave={() => onActive?.(null)}
            onFocus={() => onActive?.(row.key)}
            onBlur={() => onActive?.(null)}
          >
            {cells}
          </Link>
        ) : (
          <div key={row.key} className="trow">
            {cells}
          </div>
        );
      })}
    </div>
  );
}
