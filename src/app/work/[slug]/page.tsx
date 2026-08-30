import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ALL_PROJECTS, findProject, type Shot } from "@/lib/work";
import { metaOf } from "@/lib/format";
import Reveal from "@/components/Reveal";
import ProjectNav from "@/components/ProjectNav";
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
    description: project.intro ?? `${project.category.name} work by ${PROFILE.name}.`,
    openGraph: { images: [project.cover] },
  };
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function Figure({ shot, alt }: { shot: Shot; alt: string }) {
  return (
    <Reveal y={28}>
      <figure>
        <div
          className="relative w-full overflow-hidden bg-surface"
          style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
        >
          <Image
            src={shot.src}
            alt={alt}
            fill
            sizes="(max-width: 60rem) 100vw, 36rem"
            className="object-cover"
          />
        </div>
      </figure>
    </Reveal>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const flat: Shot[] =
    project.shots ??
    [{ src: project.cover, width: project.width ?? 4, height: project.height ?? 3 }];

  const sections = project.sections ?? [];
  const navItems = sections.map((s) => ({ title: s.title, id: slugify(s.title) }));

  const index = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const next = ALL_PROJECTS[(index + 1) % ALL_PROJECTS.length];

  return (
    <>
      <ProjectNav sections={navItems} />

      <main className="doc">
        <Reveal stagger={0.06}>
          <p>{project.title}</p>
          <p className="sub">
            {project.category.name} — {metaOf(project)}
          </p>
          {project.intro && <p className="mt-5">{project.intro}</p>}
        </Reveal>

        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.title} id={slugify(section.title)}>
              <h2 className="sec-head">{section.title}</h2>
              <div className="flex flex-col gap-3">
                {section.shots.map((shot, i) => (
                  <Figure
                    key={shot.src}
                    shot={shot}
                    alt={`${project.title} — ${section.title}, ${i + 1}`}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="mt-10 flex flex-col gap-3">
            {flat.map((shot, i) => (
              <Figure
                key={shot.src}
                shot={shot}
                alt={`${project.title}, ${i + 1} of ${flat.length}`}
              />
            ))}
          </div>
        )}

        {next && next.slug !== project.slug && (
          <Reveal className="mt-16">
            <Link href={`/work/${next.slug}`} className="table">
              <span className="cell cell-group rule-full" />
              <span className="cell cell-title rule-on">
                <span className="link">{next.title}</span>
              </span>
              <span className="cell cell-meta rule-on">Next</span>
            </Link>
          </Reveal>
        )}
      </main>
    </>
  );
}
