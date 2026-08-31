import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ALL_PROJECTS, findProject, siblingsOf, type Shot } from "@/lib/work";
import { metaOf } from "@/lib/format";
import Reveal from "@/components/Reveal";
import Showcase from "@/components/Showcase";
import PostList from "@/components/PostList";
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

  // The posts' stills join the sphere, where there is room, but not the
  // scroll, which would otherwise run to twice its length.
  const postShots: Shot[] = (project.posts ?? [])
    .map((p) => p.media)
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .map((m) => ({ src: m.src, width: m.width, height: m.height }));
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

          {project.posts && project.posts.length > 0 && (
          <section>
            <h2 className="sec-head">Published</h2>
            <PostList posts={project.posts} />
          </section>
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
