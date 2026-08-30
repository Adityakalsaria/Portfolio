import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ALL_PROJECTS, findProject } from "@/lib/work";
import { aspectOf, formatOf } from "@/lib/format";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Contact from "@/components/Contact";

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
    title: `${project.title} — Aditya Kalsariya`,
    description: `${project.category.name} work by Aditya Kalsariya.`,
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
    <>
      <Nav />
      <main className="px-5 pt-28 md:px-10 md:pt-32">
        <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="text-4xl tracking-tight md:text-6xl">{project.title}</h1>
          <p className="u-label">
            {project.category.name}
            {formatOf(project) && ` — ${formatOf(project)}`}
          </p>
        </Reveal>

        <Reveal className="mt-10 md:mt-16" y={40}>
          <div
            className="relative w-full overflow-hidden rounded-md bg-surface"
            style={{ aspectRatio: aspectOf(project) }}
          >
            <Image
              src={project.cover}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        {next && next.slug !== project.slug && (
          <Reveal className="mt-24 border-t border-line pt-6 md:mt-40">
            <Link
              href={`/work/${next.slug}`}
              data-cursor
              className="group flex items-baseline justify-between gap-4"
            >
              <span className="u-label">Next</span>
              <span className="text-2xl tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-2 md:text-4xl">
                {next.title}
              </span>
            </Link>
          </Reveal>
        )}
      </main>
      <Contact />
    </>
  );
}
