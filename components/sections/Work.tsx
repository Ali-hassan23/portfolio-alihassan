import Image from "next/image";
import { caseStudies, cta, media, personal, workSection } from "@/content/site";

// Work: the projects travel sideways past the sphere, opened by a photo of
// you at the desk and closed by the CTA.
export function Work() {
  return (
    <section id="work" className="work" data-sc-act="pan" data-sc-span="5.4" data-stage-anchor>
      <div data-sc-stage className="work__stage">
        <div className="work__rail" data-sc-pan="0.04">
          <div className="work__lead">
            <div className="work__lead-copy">
              <p className="sc-label">{workSection.label}</p>
              <h2 className="sc-display sc-display--lg">{workSection.heading}</h2>
              <p className="sc-lede">{workSection.sub}</p>
              {/* Phones only: the sphere sits under the heading and slides with the cards. */}
              <div className="backdrop-slot backdrop-slot--work" data-backdrop-slot="3" aria-hidden="true" />
            </div>
            {/* <div className="work__desk">
              <Image src={media.desk} alt={`${personal.name} coding at a desk`} width={1000} height={1625} sizes="(max-width: 760px) 40vw, 18vw" />
            </div> */}
          </div>

          {caseStudies.map((p) => (
            <article className="project" key={p.slug}>
              <div className="project__media">
                <Image src={p.image} alt={`${p.name} screenshot`} fill sizes="(max-width: 760px) 84vw, 34rem" />
              </div>
              <div className="project__body">
                <p className="project__kind">{p.kind}</p>
                <h3 className="project__name">{p.name}</h3>
                <p className="project__line">{p.oneLiner}</p>
                <dl className="project__facts">
                  <div>
                    <dt>Problem</dt>
                    <dd>{p.problem}</dd>
                  </div>
                  <div className="project__approach">
                    <dt>Approach</dt>
                    <dd>{p.approach}</dd>
                  </div>
                  <div>
                    <dt>Stack</dt>
                    <dd>{p.stack.join(", ")}</dd>
                  </div>
                </dl>
                <p className="project__outcome">{p.outcome}</p>
                {/* Always rendered, so cards with and without links line up. */}
                <p className="project__links">
                  {p.links.live ? (
                    <a className="text-link" href={p.links.live} target="_blank" rel="noreferrer">
                      Visit live site
                    </a>
                  ) : null}
                  {p.links.repo ? (
                    <a className="text-link" href={p.links.repo} target="_blank" rel="noreferrer">
                      View code
                    </a>
                  ) : null}
                </p>
              </div>
            </article>
          ))}

          <div className="work__end">
            <p className="sc-display sc-display--md">{workSection.closing}</p>
            <a className="btn btn--primary" href="#contact">
              {cta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
