"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/app/actions";
import { contact, cta, nav, personal } from "@/content/site";
import { SocialLinks } from "@/components/SocialLinks";

const initialState: ContactState = { status: "idle" };

// Contact: the form, with the @ behind it.
export function Contact() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  return (
    <section id="contact" className="sc-section contact" data-stage-anchor>
      <div className="sc-wrap contact__inner">
        <div className="contact__head sc-stack" data-sc-in data-sc-stagger="70">
          <p className="sc-label">{contact.label}</p>
          <h2 className="sc-display sc-display--xl">{contact.heading}</h2>
          <p className="sc-lede">{contact.sub}</p>
          <p className="contact__direct">
            <span className="sc-label">{contact.emailLabel}</span>
            <a className="text-link" href={`mailto:${personal.email}`}>
              {personal.email}
            </a>
          </p>
          <SocialLinks />
        </div>

        <form className="contact-form" action={formAction} data-sc-in data-sc-stagger="60">
          <div className="contact-form__row">
            <label className="contact-form__field">
              <span>{contact.fields.name}</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label className="contact-form__field">
              <span>{contact.fields.email}</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
          </div>
          <div className="contact-form__row">
            <label className="contact-form__field">
              <span>{contact.fields.projectType}</span>
              <input type="text" name="projectType" />
            </label>
            <label className="contact-form__field">
              <span>{contact.fields.budget}</span>
              <input type="text" name="budget" />
            </label>
          </div>
          <label className="contact-form__field">
            <span>{contact.fields.message}</span>
            <textarea name="message" rows={4} required />
          </label>

          <div className="contact-form__actions">
            <button className="btn btn--primary" type="submit" disabled={pending}>
              {pending ? contact.sending : cta.label}
            </button>
            {state.status !== "idle" ? (
              <p className={`contact-form__status contact-form__status--${state.status}`} role="status">
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      </div>

      <footer className="sc-wrap footer">
        <span>
          {personal.name} · {personal.role} · {personal.location}
        </span>
        <nav className="footer__links" aria-label="Footer">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <SocialLinks size="sm" />
      </footer>
    </section>
  );
}
