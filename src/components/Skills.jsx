// Skills.jsx: what I work with, as tiles in the colours of my fields. The buttons filter by shape, and the
// tiles glide to their new places (GSAP Flip) instead of jumping. Certificates and languages follow.
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import Head from "./Head";
import { FieldShape, Shape } from "./Shape";
import { certs, filters, languages, skills } from "../content";
import { ArrowUpRightIcon } from "./Icons";
import "./Skills.css";

gsap.registerPlugin(Flip);

export default function Skills({ reduced }) {
  const grid = useRef(null);
  const before = useRef(null); // where the tiles were, measured just before a filter change
  const [filter, setFilter] = useState("all");

  /** Picks a filter: notes where every tile is now, then lets React show and hide tiles. */
  const choose = (id) => {
    if (id === filter) return;
    if (!reduced) before.current = Flip.getState(grid.current.querySelectorAll(".tile"));
    setFilter(id);
  };

  // after React has shown and hidden the tiles: animate from where they were to where they are now
  useGSAP(
    () => {
      if (!before.current) return;
      Flip.from(before.current, {
        duration: 0.7,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.012,
        onEnter: (tiles) => gsap.fromTo(tiles, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.15 }),
        onLeave: (tiles) => gsap.to(tiles, { opacity: 0, scale: 0.5, duration: 0.35 }),
      });
      before.current = null;
    },
    { dependencies: [filter], scope: grid },
  );

  const shown = skills.filter(({ field }) => filter === "all" || field === filter).length;

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <Head num={4} label="Skills" title="What I work with" />

        <div className="skills__bar" data-reveal>
          <div className="skills__filters" role="group" aria-label="Filter the skills">
            {filters.map(({ id, label, shape }) => (
              <button key={id} type="button" className={`chip${filter === id ? " is-on" : ""}`} aria-pressed={filter === id}
                onClick={() => choose(id)}>
                {shape && <FieldShape field={id} size={14} />}
                {label}
              </button>
            ))}
          </div>
          <p className="skills__count mono" aria-live="polite">
            {shown} of {skills.length}
          </p>
        </div>

        <ul className="tiles" ref={grid}>
          {skills.map(({ name, note, field }) => (
            <li key={name} className={`tile tile--${field}${filter !== "all" && field !== filter ? " is-hidden" : ""}`}
              data-flip-id={name} data-cursor={field}>
              <FieldShape field={field} size={20} className="tile__shape" />
              <p className="tile__name">{name}</p>
              {note && <p className="tile__note">{note}</p>}
            </li>
          ))}
        </ul>

        <div className="creds">
          <div className="creds__certs">
            <h3 className="creds__title" data-reveal>
              Certificates
            </h3>
            <ul>
              {certs.map(({ name, issuer, when, href, inProgress }) => (
                <li key={name} className={`cert${inProgress ? " cert--progress" : ""}`} data-reveal>
                  <Shape kind={inProgress ? "triangle" : "circle"} color={inProgress ? "var(--yellow)" : "var(--blue)"} size={26} />
                  <div>
                    <p className="cert__name">{name}</p>
                    <p className="cert__meta">
                      {issuer} · {when}
                    </p>
                  </div>
                  {href ? (
                    <a className="cert__link" href={href} target="_blank" rel="noreferrer" aria-label={`View the certificate: ${name}`}>
                      <ArrowUpRightIcon />
                    </a>
                  ) : (
                    <span className="cert__badge mono">In progress</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="creds__langs" data-reveal>
            <h3 className="creds__title">Languages</h3>
            <ul>
              {languages.map(({ name, level }) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className="mono">{level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
