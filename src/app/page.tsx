import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkIndex from "@/components/WorkIndex";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <WorkIndex />
        <About />
      </main>
      <Contact />
    </>
  );
}
