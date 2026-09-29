import { cta, experience, experienceSection, personal, techStack } from "@/content/site";

// Experience: the timeline, with the git graph of it drawn behind.
export function Experience() {
  return (
    <section id="experience" className="sc-section experience" data-sc-act="flow" data-stage-anchor>
      <div className="sc-wrap experience__inner">
        <div className="sc-stack" data-sc-in data-sc-stagger="70">
          <p className="sc-label">{experienceSection.label}</p>
          <h2 className="sc-display sc-display--lg">{experienceSection.heading}</h2>
        </div>

        <ol className="timeline" data-sc-reveal="down" data-sc-reveal-at="0.1 0.45">
          {experience.map((job) => (
            <li className="timeline__item" data-current={job.current ? "true" : undefined} key={job.org}>
              <p className="timeline__period">{job.period}</p>
              <h3 className="timeline__role">
                {job.role} <span className="timeline__org">at {job.org}</span>
              </h3>
              {job.location ? <p className="timeline__where">{job.location}</p> : null}
              <p className="timeline__summary">{job.summary}</p>
            </li>
          ))}
        </ol>

        <div className="stack-list" data-sc-in>
          <p className="sc-label">{experienceSection.stackLabel}</p>
          <ul>
            {techStack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {personal.cv ? (
            <a className="btn btn--ghost" href={personal.cv} download>
              {cta.cv}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
