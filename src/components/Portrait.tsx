import Image from "next/image";

/**
 * The portrait sits above the name in the flow. It used to lift in on hover,
 * which meant it never appeared on touch and the page carried 11rem of
 * headroom purely to give the card somewhere to go.
 */
export default function Portrait({ alt }: { alt: string }) {
  return (
    <span className="portrait">
      <Image
        src="/portrait.jpg"
        alt={alt}
        fill
        sizes="112px"
        className="object-cover"
        style={{ objectPosition: "50% 18%" }}
        priority
      />
    </span>
  );
}
