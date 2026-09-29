import { Backdrop } from "@/components/backdrop/Backdrop";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { Experience } from "@/components/sections/Experience";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { ChatBubble } from "@/components/ChatBubble";

export default function Home() {
  return (
    <>
      <Backdrop />
      <Nav />
      <main className="page">
        <Hero />
        <About />
        <Services />
        <Work />
        <Process />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <ChatBubble />
    </>
  );
}
