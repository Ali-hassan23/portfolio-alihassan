"use client";

import { useEffect, useState } from "react";
import { cta, nav, personal } from "@/content/site";

// Top bar: your name, the sections, one CTA. The link for the section under
// the middle of the screen is marked current.
export function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) current = el.id;
      }
      setActive(current);
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className="topbar" data-scrolled={scrolled ? "true" : "false"}>
      <a className="topbar__mark" href="#top" aria-label={`${personal.name}, back to top`}>
        <span className="topbar__dot" aria-hidden="true" />
        {personal.name}
      </a>
      <nav className="topbar__nav" aria-label="Sections">
        {nav.map((item) => (
          <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="btn btn--primary btn--sm" href="#contact">
        {cta.label}
      </a>
    </header>
  );
}
