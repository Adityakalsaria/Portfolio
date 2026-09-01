import { notFound } from "next/navigation";
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
  // Runs over the flat list: each campaign's start and length.
  const groups = sections.reduce<{ title: string; start: number; count: number }[]>(
    (acc, section) => {
      const last = acc.at(-1);
      const start = last ? last.start + last.count : 0;
      acc.push({ title: section.title, start, count: section.shots.length });
      return acc;
    },
    []
  );


  return (
    <>
      <ProjectNav
        siblings={siblingsOf(slug).map((p) => ({ slug: p.slug, title: p.title }))}
        currentSlug={slug}
      />

      <main className="doc">
        <Reveal stagger={0.06}>
          <p>{project.title}</p>
          <p className="sub">
            {[project.category.name, metaOf(project)].filter(Boolean).join(" — ")}
          </p>
          {project.intro && <p className="mt-5">{project.intro}</p>}
        </Reveal>

        {/* One gallery, with the campaigns as runs inside it. Rendering a
            Showcase per section gave a project with nine campaigns nine
            separate galleries and nine view switches. */}
        <Showcase
          shots={flat}
          sphereShots={sphereShots}
          gridShots={sphereShots}
          groups={groups}
          title={project.title}
        />

      </main>
    </>
  );
}
