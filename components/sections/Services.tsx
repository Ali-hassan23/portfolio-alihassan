import { services, servicesSection } from "@/content/site";

// Services: one row per layer; the plane behind lights as the reader reaches it.
export function Services() {
  return (
    <section id="services" className="sc-section services" data-stage-anchor>
      <div className="sc-wrap">
        <div className="services__head sc-stack" data-sc-in data-sc-stagger="70">
          <p className="sc-label">{servicesSection.label}</p>
          <h2 className="sc-display sc-display--lg">{servicesSection.heading}</h2>
          <p className="sc-lede">{servicesSection.sub}</p>
        </div>
        {/* Phones only: the stacked layers get their own space here. */}
        <div className="backdrop-slot backdrop-slot--services" data-backdrop-slot="2" aria-hidden="true" />
        <ol className="services__list">
          {services.map((s, i) => (
            <li className="service" data-layer={i} key={s.title} data-sc-in>
              <span className="service__index">{String(i + 1).padStart(2, "0")}</span>
              <div className="service__body">
                <h3 className="service__title">{s.title}</h3>
                <p className="service__need">{s.need}</p>
                <p className="service__deliver">{s.deliver}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
