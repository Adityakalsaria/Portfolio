import WorkList from "@/components/WorkList";
import RowTable from "@/components/RowTable";
import { PROFILE, EXPERIENCE, CLIENTS, byYear } from "@/lib/cv";

const X = `https://x.com/${PROFILE.x}`;
const DRIBBBLE = `https://dribbble.com/${PROFILE.dribbble}`;
const LINKEDIN = `https://www.linkedin.com/in/${PROFILE.linkedin}`;

const toGroups = (entries: typeof EXPERIENCE) =>
  byYear(entries).map((g) => ({
    name: g.name,
    items: g.items.map((e) => ({
      key: e.title + e.year + e.period,
      title: e.company ? `${e.title}, ${e.company}` : e.title,
      meta: e.period,
    })),
  }));

export default function Home() {
  return (
    <main className="doc">
      <header>
        <p>{PROFILE.name}</p>
        <p className="sub">{PROFILE.role}</p>
      </header>

      <section>
        <p>
          I&rsquo;m a self-taught designer working across visual design, 3D,
          motion, icon design and art direction.
        </p>
        <p>
          I currently work at KOSH, formerly Copperx, as a product and brand
          designer. I led the rebrand, and I design the exchange, the mobile app
          and the campaigns around them.
        </p>
        <p>
          You can find me on{" "}
          <a className="link" href={X} target="_blank" rel="noreferrer">
            X
          </a>
          ,{" "}
          <a className="link" href={DRIBBBLE} target="_blank" rel="noreferrer">
            Dribbble
          </a>{" "}
          and{" "}
          <a className="link" href={LINKEDIN} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          , or reach me via{" "}
          <a className="link" href={`mailto:${PROFILE.email}`}>
            email
          </a>
          .
        </p>
      </section>

      <section>
        <WorkList />
      </section>

      <section>
        <RowTable label="Experience" groups={toGroups(EXPERIENCE)} />
      </section>

      <section>
        <RowTable label="Freelance" groups={toGroups(CLIENTS)} />
      </section>
    </main>
  );
}
