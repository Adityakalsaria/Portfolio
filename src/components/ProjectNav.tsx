import Link from "next/link";

export type NavProject = { slug: string; title: string };

type Props = {
  /** In-page sections, when the project has them. */
  sections?: { title: string; id: string }[];
  /** The other work in this category, so it is reachable without going back. */
  siblings?: NavProject[];
  /** Which sibling is being shown, marked rather than linked to itself. */
  currentSlug?: string;
};

/**
 * Sits in the left margin on wide screens and scrolls away on narrow ones,
 * where a fixed rail would cover the content it indexes.
 */
export default function ProjectNav({
  sections = [],
  siblings = [],
  currentSlug,
}: Props) {
  // A list of one says nothing the page does not already say.
  const showSiblings = siblings.length > 1;

  return (
    <nav className="pnav">
      <Link href="/" className="pnav-index link">
        ↩ Back
      </Link>

      {showSiblings && (
        <ul className="pnav-list">
          {siblings.map((p) => (
            <li key={p.slug}>
              {p.slug === currentSlug ? (
                <span className="pnav-item is-on" aria-current="page">
                  {p.title}
                </span>
              ) : (
                <Link href={`/work/${p.slug}`} className="pnav-item">
                  {p.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

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
