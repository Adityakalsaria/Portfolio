import Image from "next/image";

/** A plain portrait above the name. */
export default function Portrait({ alt }: { alt: string }) {
  return (
    <span className="portrait">
      {/* Square source into a square tile, so object-cover crops nothing. */}
      <Image
        src="/portrait.webp"
        alt={alt}
        fill
        sizes="176px"
        className="object-cover"
        priority
      />
    </span>
  );
}
