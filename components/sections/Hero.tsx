import Image from "next/image";
import { cta, hero, media, personal } from "@/content/site";
import { SocialLinks } from "@/components/SocialLinks";

// Hero: you, between the two planes of the </> behind and in front of you.
export function Hero() {
  return (
    <section id="top" className="hero" data-sc-act="flow" data-stage-anchor>
      <div className="sc-wrap hero__inner">
        <div className="hero__copy sc-stack" data-sc-in data-sc-stagger="70">
          <p className="hero__status">
            <span className="hero__pulse" aria-hidden="true" />
            {personal.availability} · {personal.location}
          </p>
          <p className="hero__greeting">{hero.greeting}</p>
          <h1 className="sc-display sc-display--xl hero__title">{hero.headline}</h1>
          <p className="sc-lede hero__sub">{hero.sub}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              {cta.label}
            </a>
            {personal.cv ? (
              <a className="btn btn--ghost" href={personal.cv} target="_blank" rel="noopener noreferrer">
                {cta.cv}
              </a>
            ) : null}
            <a className="text-link" href="#work">
              {hero.workLink}
            </a>
          </div>
          <SocialLinks size="sm" />
        </div>
      </div>
      <div className="hero__portrait" data-sc-parallax="-1.1">
        <Image
          src={media.portrait}
          alt={`${personal.name}, ${personal.role}`}
          width={1100}
          height={1385}
          priority
          sizes="(max-width: 760px) 90vw, 42vw"
        />
      </div>
      {/* Foreground plane: rides faster than the portrait, so it reads as nearer. */}
      <div className="hero__chips" data-sc-parallax="2.2" aria-hidden="true">
        {hero.chips.map((c, i) => (
          <span className={`hero__chip hero__chip--${i}`} key={c}>
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}
