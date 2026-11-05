// Contact.jsx: the end. "Say hello" in huge letters, where the "o" is a blue circle; what I'm looking for; the
// time in Weimar right now (so you know if it's day or night here); my email with a copy button; my links.
import { useEffect, useState } from "react";
import { contact, person } from "../content";
import { CheckIcon, CopyIcon, DownloadIcon, GitHubIcon, LinkedInIcon } from "./Icons";
import "./Contact.css";

/** The time in Weimar, like "14:05", updated every 20 seconds. */
function useWeimarTime() {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", { timeZone: person.timeZone, hour: "2-digit", minute: "2-digit" }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const timer = setInterval(() => setTime(format()), 20000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return time;
}

export default function Contact() {
  const time = useWeimarTime();
  const [copied, setCopied] = useState(false);

  /** Copies my email address and says so for two seconds (opens the mail app if copying isn't allowed). */
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <p className="contact__label mono" data-reveal>
          06 / Contact
        </p>
        <h2 className="contact__title" aria-label={contact.title} data-reveal>
          <span aria-hidden="true">
            Say hell<span className="contact__o" />
          </span>
        </h2>

        <div className="contact__grid">
          <div data-reveal>
            <p className="contact__text">{contact.text}</p>
            <p className="pill contact__pill">
              <span className="pulse" aria-hidden="true" /> {contact.availability}
            </p>
            <p className="contact__time mono">
              It's {time} in Weimar right now
            </p>
          </div>

          <div className="contact__actions" data-reveal>
            <div className="contact__email">
              <a href={`mailto:${person.email}`} className="contact__address">
                {person.email}
              </a>
              <button type="button" className="btn btn--red btn--small" onClick={copy} aria-live="polite">
                {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="contact__links">
              <a className="btn btn--small" href={person.linkedin} target="_blank" rel="noreferrer">
                <LinkedInIcon /> LinkedIn
              </a>
              <a className="btn btn--small" href={person.github} target="_blank" rel="noreferrer">
                <GitHubIcon /> GitHub
              </a>
              <a className="btn btn--small btn--solid" href={person.cv} target="_blank" rel="noreferrer">
                <DownloadIcon /> CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
