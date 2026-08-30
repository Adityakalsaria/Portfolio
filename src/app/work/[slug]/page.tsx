import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ALL_PROJECTS, findProject } from "@/lib/work";
import { aspectOf, formatOf } from "@/lib/format";
import Reveal from "@/components/Reveal";
import { PROFILE } from "@/lib/cv";

export function generateStaticParams() {
  return ALL_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${PROFILE.name}`,
    description: `${project.category.name} work by ${PROFILE.name}.`,
    openGraph: { images: [project.cover] },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const index = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const next = ALL_PROJECTS[(index + 1) % ALL_PROJECTS.length];

  return (
    <main className="doc">
      <Reveal stagger={0.06}>
        <Link href="/" className="link text-[0.9375rem] text-muted">
          {PROFILE.name}
        </Link>
        <h1 className="mt-8 text-[1.0625rem]">{project.title}</h1>
        <p className="text-[1.0625rem] italic text-muted">
          {project.category.name}
          {formatOf(project) && ` — ${formatOf(project)}`}
        </p>
      </Reveal>

      <Reveal className="mt-10" y={36}>
        <div
          className="relative w-full overflow-hidden bg-surface"
          style={{ aspectRatio: aspectOf(project) }}
        >
          <Image
            src={project.cover}
            alt={project.title}
            fill
            sizes="(max-width: 60rem) 100vw, 40rem"
            className="object-cover"
            priority
          />
        </div>
      </Reveal>

      {next && next.slug !== project.slug && (
        <Reveal className="mt-14">
          <Link href={`/work/${next.slug}`} className="row">
            <span className="link">{next.title}</span>
            <span className="row-meta">Next</span>
          </Link>
        </Reveal>
      )}
    </main>
  );
}
