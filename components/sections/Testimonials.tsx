import { testimonials, testimonialsSection } from "@/content/site";

// Only real quotes. While the list in content/site.ts is empty, nothing renders.
export function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section id="testimonials" className="sc-section testimonials">
      <div className="sc-wrap">
        <div className="sc-stack" data-sc-in data-sc-stagger="70">
          <p className="sc-label">{testimonialsSection.label}</p>
          <h2 className="sc-display sc-display--lg">{testimonialsSection.heading}</h2>
        </div>
        <div className="testimonials__grid" data-sc-in data-sc-stagger="80">
          {testimonials.map((t) => (
            <figure className="quote" key={t.name}>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
