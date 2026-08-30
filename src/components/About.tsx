import Reveal from "./Reveal";

const FACTS: [string, string][] = [
  ["Now", "Product Designer, Copperx"],
  ["Focus", "Fintech, crypto, developer tools"],
  ["Also", "Builds 3D mockup and render tooling"],
  ["Based", "India — working remotely"],
];

export default function About() {
  return (
    <section id="about" className="px-5 py-24 md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-4">
          <h2 className="u-label">About</h2>
        </Reveal>

        <Reveal className="md:col-span-8" stagger={0.1}>
          <p className="text-balance text-2xl leading-tight tracking-tight md:text-4xl">
            I work best where design has to carry weight — a page that has to
            convert, a flow that has to hold up under real money, a component
            set that has to survive a year of feature requests.
          </p>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Most of my work sits in fintech and crypto, where the hard part is
            rarely the visual. It&rsquo;s making something unfamiliar feel
            obvious. Outside client work I build my own tools — a 3D mockup
            studio for rendering app screens, and a generator for 3D assets.
          </p>

          <dl className="mt-14 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="u-label">{k}</dt>
                <dd className="mt-1 text-base">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
