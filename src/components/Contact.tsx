import Reveal from "./Reveal";

const LINKS: [string, string][] = [
  ["Email", "mailto:aditya.k@copperx.io"],
  ["Dribbble", "https://dribbble.com/adi_kalsaria_"],
  ["GitHub", "https://github.com/Adityakalsaria"],
];

export default function Contact() {
  return (
    <footer id="contact" className="px-5 pb-8 pt-24 md:px-10 md:pb-10 md:pt-40">
      <Reveal stagger={0.09}>
        <p className="u-label">Contact</p>
        <a
          href="mailto:aditya.k@copperx.io"
          data-cursor
          className="mt-4 block u-display transition-opacity duration-300 hover:opacity-70"
        >
          Say hello
        </a>
      </Reveal>

      <Reveal className="mt-20 flex flex-wrap items-end justify-between gap-8 border-t border-line pt-6 md:mt-32">
        <ul className="flex flex-wrap gap-6">
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                data-cursor
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="text-sm text-muted transition-colors duration-200 hover:text-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="u-label">© 2026</p>
      </Reveal>
    </footer>
  );
}
