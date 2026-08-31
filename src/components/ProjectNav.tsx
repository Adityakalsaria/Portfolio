import Link from "next/link";

type Props = {
  /** In-page sections, when the project has them. */
  sections?: { title: string; id: string }[];
};

/**
 * Sits in the left margin on wide screens and scrolls away on narrow ones,
 * where a fixed rail would cover the content it indexes.
 */
export default function ProjectNav({ sections = [] }: Props) {
  return (
    <nav className="pnav">
      <Link href="/" className="pnav-index link">
        ↩ Back
      </Link>

      {sections.length > 0 && (
        <ul className="pnav-list">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="pnav-item">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
