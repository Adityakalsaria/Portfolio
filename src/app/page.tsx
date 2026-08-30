import WorkList from "@/components/WorkList";
import { PROFILE } from "@/lib/cv";

const X = `https://x.com/${PROFILE.x}`;
const DRIBBBLE = `https://dribbble.com/${PROFILE.dribbble}`;
const LINKEDIN = `https://www.linkedin.com/in/${PROFILE.linkedin}`;

export default function Home() {
  return (
    <main className="doc">
      <header>
        <p>{PROFILE.name}</p>
        <p className="sub">{PROFILE.role}</p>
      </header>

      {/* The career reads as prose. Only the work itself gets a table. */}
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
          Before that I spent five years on brand and product design across
          crypto — a brand refresh for Bungee protocol, rebrand work on the
          Polygon wallet suite and helpdesk, and campaign identities for BuidlIT,
          Polygon Ignite, Jampad and Connect.
        </p>
        <p>
          I&rsquo;ve also worked with BoomFi, Superfluid, Devfolio, MahaDAO,
          Timeswap, Polytrade, Flame.Live and Dacoit.design.
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
        <p className="label">Work</p>
        <WorkList />
      </section>
    </main>
  );
}
