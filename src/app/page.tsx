import WorkList from "@/components/WorkList";
import Portrait from "@/components/Portrait";
import RowTable from "@/components/RowTable";
import Timeline from "@/components/Timeline";
import { PROFILE, CLIENTS } from "@/lib/cv";

const X = `https://x.com/${PROFILE.x}`;
const LINKEDIN = `https://www.linkedin.com/in/${PROFILE.linkedin}`;

// One group, flat: the year lives in each entry's period, so there is no
// year gutter to group by.
const clientRows = [
  {
    name: "",
    items: CLIENTS.map((e) => ({
      key: e.title + e.year + e.period,
      title: e.company ? `${e.title}, ${e.company}` : e.title,
      meta: e.period,
    })),
  },
];

export default function Home() {
  return (
    <main className="doc">
      <header>
        <Portrait alt={`Photograph of ${PROFILE.name}`} />
        <p>{PROFILE.name}</p>
        <p className="sub">{PROFILE.role}</p>
      </header>

      <section>
        <p>
          I&rsquo;m a self-taught designer working across visual design, 3D,
          motion, icon design and art direction.
        </p>
        <p>
          I&rsquo;m currently building{" "}
          <a className="link" href="https://mocraft.app" target="_blank" rel="noreferrer">
            mocraft.app
          </a>
          , a 3D mockup studio where you put a screenshot on a phone, frame the
          shot and export a still or a video. I&rsquo;m also helping Conscious
          Engines with brand design. Previously, I was leading visual and UI design at KOSH, formerly
          Copperx, where I led the rebrand and designed the exchange, the mobile
          app and the campaigns around them.
        </p>
        <p>
          You can find me on{" "}
          <a className="link" href={X} target="_blank" rel="noreferrer">
            X
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
        <p className="label">Experience</p>
        <Timeline />
      </section>

      <section>
        <RowTable label="Freelance" groups={clientRows} flat />
      </section>
    </main>
  );
}
