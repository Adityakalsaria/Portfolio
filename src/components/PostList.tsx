import Image from "next/image";
import type { Post } from "@/lib/posts";

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Link previews for posts, each one a card that opens the original.
 *
 * The media is served from this site rather than pbs.twimg.com: those URLs
 * are not guaranteed stable, are blocked on some networks, and would make
 * every card a third-party request on load. Video posts show their poster
 * frame, which is all a preview needs.
 */
export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="posts">
      {posts.map((p) => (
        <li key={p.id}>
          <a
            className="post"
            href={p.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Post by @${p.author}, ${when(p.date)}`}
          >
            {p.media && (
              <span className="post-media">
                <Image
                  src={p.media.src}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                {p.video && <span className="post-play" aria-hidden />}
              </span>
            )}
            <span className="post-body">
              <span className="post-meta sub">
                @{p.author} · {when(p.date)}
              </span>
              <span className="post-text">{p.text}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
