import Reveal from "@/components/Reveal";
import WorkList from "@/components/WorkList";
import { PROFILE, EXPERIENCE, CLIENTS, EDUCATION, TOOLS } from "@/lib/cv";

export default function Home() {
  return (
    <main className="doc">
      <Reveal stagger={0.06}>
        <h1 className="text-[1.0625rem]">{PROFILE.name}</h1>
        <p className="text-[1.0625rem] italic text-muted">{PROFILE.role}</p>
      </Reveal>

      <Reveal className="mt-10" stagger={0.07}>
        <p>
          I&rsquo;m a self-taught designer working across visual design, 3D,
          motion, icon design and art direction. I&rsquo;ve spent most of the
          last five years in crypto and fintech, where the hard part is rarely
          the visual — it&rsquo;s making something unfamiliar feel obvious.
        </p>
        <p className="mt-5">
          Right now I&rsquo;m at{" "}
          <span className="italic">KOSH</span>, where I designed the rebrand
          from Copperx and work on the exchange, the mobile app and the
          campaigns around them.
        </p>
      </Reveal>

      <section>
        <p className="eyebrow">Work</p>
        <WorkList />
      </section>

      <section>
        <p className="eyebrow">Experience</p>
        {EXPERIENCE.map((role) => (
          <div key={role.title + role.period} className="row">
            <span>
              {role.title}
              {role.company && (
                <span className="text-muted">, {role.company}</span>
              )}
            </span>
            <span className="row-meta">{role.period}</span>
          </div>
        ))}
      </section>

      <section>
        <p className="eyebrow">Freelance and contract</p>
        {CLIENTS.map((c) => (
          <div key={c.name} className="row">
            <span>
              {c.name}
              <span className="text-muted">, {c.role}</span>
            </span>
            <span className="row-meta">{c.period}</span>
          </div>
        ))}
      </section>

      <section>
        <p className="eyebrow">Tools</p>
        <p>{TOOLS.join(", ")}.</p>
        <p className="eyebrow mt-8">Education</p>
        <p>
          {EDUCATION.degree}, {EDUCATION.school}
          <span className="text-muted"> — {EDUCATION.period}</span>
        </p>
      </section>

      <section>
        <p className="eyebrow">Elsewhere</p>
        <p>
          <a className="link" href={`mailto:${PROFILE.email}`}>
            Email
          </a>
          ,{" "}
          <a
            className="link"
            href={`https://x.com/${PROFILE.x}`}
            target="_blank"
            rel="noreferrer"
          >
            X
          </a>
          ,{" "}
          <a
            className="link"
            href={`https://www.linkedin.com/in/${PROFILE.linkedin}`}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          ,{" "}
          <a
            className="link"
            href={`https://dribbble.com/${PROFILE.dribbble}`}
            target="_blank"
            rel="noreferrer"
          >
            Dribbble
          </a>
          .
        </p>
      </section>
    </main>
  );
}
