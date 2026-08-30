"use client";

import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  children: React.ReactNode;
};

/**
 * Wraps a run of text so a photo lifts into view above it on hover.
 *
 * The card is absolutely positioned against the text it belongs to, so it
 * tracks the word even when the line wraps, and it is pointer-events:none so
 * it can never swallow a hover from the text underneath it.
 */
export default function HoverPhoto({ src, alt, children }: Props) {
  return (
    <span className="hphoto" tabIndex={0}>
      <span className="hphoto-card" aria-hidden>
        <Image src={src} alt="" fill sizes="112px" className="object-cover" />
      </span>
      <span className="hphoto-text">{children}</span>
      <span className="sr-only">{alt}</span>
    </span>
  );
}
