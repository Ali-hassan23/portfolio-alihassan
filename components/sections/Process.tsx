import { process } from "@/content/site";

// Process: pinned. Each step lights as the pulse reaches its block in the
// pipeline behind (the backdrop sets data-state on each step).
export function Process() {
  return (
    <section id="process" className="process" data-sc-act="pin" data-sc-span="3.4" data-stage-anchor>
      <div data-sc-stage className="process__stage">
        <div className="sc-wrap process__inner">
          <div className="process__head">
            <p className="sc-label">{process.label}</p>
            <h2 className="sc-display sc-display--lg">{process.heading}</h2>
            <p className="sc-lede">{process.sub}</p>
          </div>
          <ol className="steps">
            {process.steps.map((s, i) => (
              <li className="steps__item" data-step={i} data-state={i === 0 ? "active" : "todo"} key={s.title}>
                <span className="steps__index">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="steps__title">{s.title}</h3>
                  <p className="steps__text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
