import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ALL_PROJECTS,
  findProject,
  siblingsOf,
  type Shot,
  type SphereShot,
} from "@/lib/work";
import { metaOf } from "@/lib/format";
import Reveal from "@/components/Reveal";
import Showcase from "@/components/Showcase";
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

  // The posts live in the sphere, where their clips play on the plane, rather
  // than as a second list under the work.
  const postShots: SphereShot[] = (project.posts ?? [])
    .filter((p) => p.media)
    .map((p) => ({
      src: p.media!.src,
      width: p.media!.width,
      height: p.media!.height,
      href: p.url,
      video: p.video,
      clip: p.clip ?? undefined,
    }));
  const sphereShots = [...flat, ...postShots];

  const sections = project.sections ?? [];
  const navItems = sections.map((s) => ({ title: s.title, id: slugify(s.title) }));

  const index = ALL_PROJECTS.findIndex((p) => p.slug === slug);
  const next = ALL_PROJECTS[(index + 1) % ALL_PROJECTS.length];

  return (
    <>
      <ProjectNav
        sections={navItems}
        siblings={siblingsOf(slug).map((p) => ({ slug: p.slug, title: p.title }))}
        currentSlug={slug}
      />

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
              <Showcase shots={section.shots} title={`${project.title} — ${section.title}`} />
            </section>
          ))
        ) : (
          <Showcase shots={flat} sphereShots={sphereShots} title={project.title} />
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
