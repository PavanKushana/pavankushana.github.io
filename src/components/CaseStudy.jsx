// CaseStudy.jsx: one project in full, in a panel that slides up over the page: what it is, why, how it works,
// the numbers, the stack, the links, the video and frames for screenshots. Escape, the close button or a click
// outside closes it, and the keyboard focus goes back to the poster's button.
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Photo from "./Photo";
import VideoEmbed from "./VideoEmbed";
import { FieldShape, FIELD } from "./Shape";
import { pauseScroll } from "../hooks/motion";
import { ArrowUpRightIcon, CloseIcon } from "./Icons";
import "./CaseStudy.css";

/** project: the project from content.js; reduced: no slide; onClose: called after the panel has slid away. */
export default function CaseStudy({ project, reduced, onClose }) {
  const panel = useRef(null);
  const backdrop = useRef(null);
  const closeButton = useRef(null);
  const opener = useRef(document.activeElement); // the poster button, to give the focus back
  const closing = useRef(false);

  /** Slides the panel away, then tells the page it's closed. */
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (reduced) {
      onClose();
      return;
    }
    gsap.to(backdrop.current, { opacity: 0, duration: 0.35 });
    gsap.to(panel.current, { yPercent: 100, duration: 0.5, ease: "power3.in", onComplete: onClose });
  };

  // the entrance (useGSAP undoes it cleanly if React runs this twice, as it does in development)
  useGSAP(() => {
    if (reduced) return;
    gsap.from(backdrop.current, { opacity: 0, duration: 0.4 });
    gsap.from(panel.current, { yPercent: 100, duration: 0.75, ease: "power4.out" });
  });

  useEffect(() => {
    const trigger = opener.current;
    pauseScroll(true);
    closeButton.current.focus({ preventScroll: true });
    // Escape closes; Tab stays inside the panel while it's open
    const onKey = (event) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const focusable = panel.current.querySelectorAll("a[href], button:not([disabled]), iframe");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      pauseScroll(false);
      trigger?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { title, year, kind, fields, tagline, summary, why, stats, steps, stack, video, links, shots } = project;

  return createPortal(
    <div className="case" role="dialog" aria-modal="true" aria-labelledby="case-title">
      <div className="case__backdrop" ref={backdrop} onClick={close} />
      <article className="case__panel" ref={panel} data-lenis-prevent>
        <button type="button" className="case__close" ref={closeButton} onClick={close} aria-label="Close the case study">
          <CloseIcon />
        </button>

        <header className="case__head">
          <p className="case__meta mono">
            {fields.map((field) => (
              <span key={field}>
                <FieldShape field={field} size={14} /> {FIELD[field].label}
              </span>
            ))}
            <span>{year}</span>
          </p>
          <h2 id="case-title" className="case__title">{title}</h2>
          <p className="case__kind">{kind}</p>
          <p className="case__tagline">{tagline}</p>
        </header>

        <div className="case__grid">
          <div className="case__main">
            <p className="case__summary">{summary}</p>
            <blockquote className="case__why">
              <span className="mono">{steps ? "Why I built it" : "What I took from it"}</span>
              {why}
            </blockquote>
            {steps && (
              <>
                <h3 className="case__sub">How one incident flows</h3>
                <ol className="case__steps">
                  {steps.map(([name, text], i) => (
                    <li key={name}>
                      <span className="case__step-num">{i + 1}</span>
                      <span>
                        <strong>{name}</strong> {text}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>

          <aside className="case__side">
            {video && <VideoEmbed id={video.id} title={video.title} />}
            {stats && (
              <dl className="case__stats">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <dt>{value}</dt>
                    <dd>{label}</dd>
                  </div>
                ))}
              </dl>
            )}
            <ul className="tags" aria-label="Built with">
              {stack.map((item) => (
                <li key={item} className="tag">{item}</li>
              ))}
            </ul>
            <div className="case__links">
              {links.map(({ label, href }) => (
                <a key={href} className="btn btn--small" href={href} target="_blank" rel="noreferrer">
                  {label} <ArrowUpRightIcon />
                </a>
              ))}
            </div>
          </aside>
        </div>

        <div className="case__shots">
          {shots.map((shot, i) => (
            <Photo key={shot.label} photo={shot} accent={i} className="case__shot" />
          ))}
        </div>
      </article>
    </div>,
    document.body,
  );
}
