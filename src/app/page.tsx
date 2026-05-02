import { FloatingIcons } from "@/components/FloatingIcons";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { EduExp } from "@/components/EduExp";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <FloatingIcons />
      <Nav />
      <main>
        <Hero />
        <div className="section-sep" />
        <Stats />
        <div className="section-sep" />
        <About />
        <div className="section-sep" />
        <Skills />
        <div className="section-sep" />
        <Projects />
        <div className="section-sep" />
        <EduExp />
        <div className="section-sep" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
