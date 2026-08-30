export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 mix-blend-difference md:px-10">
      <a href="#top" data-cursor className="text-sm font-medium tracking-tight">
        Aditya Kalsariya
      </a>
      <ul className="flex gap-6">
        {[
          ["Work", "#work"],
          ["About", "#about"],
          ["Contact", "#contact"],
        ].map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              data-cursor
              className="text-sm text-muted transition-colors duration-200 hover:text-text"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
