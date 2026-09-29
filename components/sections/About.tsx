import { about, media, personal } from "@/content/site";

// About: the clip of you at work opens between the { } behind it.
export function About() {
  return (
    <section id="about" className="sc-section about" data-sc-act="flow" data-stage-anchor>
      <div className="sc-wrap about__inner">
        <figure className="about__window" data-sc-reveal="up" data-sc-reveal-at="0.08 0.42">
          <div className="about__chrome" aria-hidden="true">
            <span />
            <span />
            <span />
            <code>{about.windowTitle}</code>
          </div>
          <video
            className="about__video"
            src={media.video}
            poster={media.videoPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={`${personal.name} at work, writing code at a desk`}
          />
        </figure>

        <div className="about__copy sc-stack" data-sc-in data-sc-stagger="70">
          <p className="sc-label">{about.label}</p>
          <h2 className="sc-display sc-display--lg">{about.heading}</h2>
          {about.paragraphs.map((p) => (
            <p className="sc-body" key={p.slice(0, 32)}>
              {p}
            </p>
          ))}
          <dl className="facts">
            {about.facts.map((f) => (
              <div className="facts__row" key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
