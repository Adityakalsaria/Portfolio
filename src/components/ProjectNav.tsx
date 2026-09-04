import Link from "next/link";

export type NavProject = { slug: string; title: string };

type Props = {
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
  siblings = [],
  currentSlug,
}: Props) {
  // A list of one says nothing the page does not already say.
  const showSiblings = siblings.length > 1;

  return (
    <>
      {/* The veil is a sibling of the rail, not a child of it: filtering an
          element blurs its whole subtree, and the index has to stay sharp. */}
      <span className="veil" aria-hidden />
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
      </nav>
    </>
  );
}
