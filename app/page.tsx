import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Diagnostic } from "@/components/sections/Diagnostic";
import { Methodology } from "@/components/sections/Methodology";
import { Solutions } from "@/components/sections/Solutions";
import { Evidence } from "@/components/sections/Evidence";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <Problems />
        <Diagnostic />
        <Methodology />
        <Solutions />
        <Evidence />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
