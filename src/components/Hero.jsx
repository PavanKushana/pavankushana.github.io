// Hero.jsx: the first screen. My name in big geometric letters that get bolder where the cursor is (a
// variable font, React Bits VariableProximity), my three fields with their shapes, and the physics frame.
import { Suspense, lazy, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import VariableProximity from "./reactbits/VariableProximity/VariableProximity";

// the physics engine loads in its own file, so the text shows first; the empty frame (styled by Playground.css,
// loaded here already) waits for it
import "./Playground.css";
const Playground = lazy(() => import("./Playground"));
import { FieldShape } from "./Shape";
import { hero, person } from "../content";
import { isTouch, scrollToId } from "../hooks/motion";
import { ArrowRightIcon, DownloadIcon } from "./Icons";
import "./Hero.css";

// the name, split in two lines; each line reacts to the pointer on its own
const NAME_LINES = ["Pavan Sai", "Kushana"];

export default function Hero({ reduced, theme }) {
  const root = useRef(null);

  // the entrance: the name's lines slide up out of a mask, then the rest comes in one part after another
  useGSAP(
    () => {
      if (reduced) return;
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      timeline
        .from(".hero__line-inner", { yPercent: 110, duration: 1.2, stagger: 0.12, delay: 0.15 })
        .from(".hero__in", { opacity: 0, y: 24, duration: 0.9, stagger: 0.08 }, "-=0.7")
        .from(".hero__fields .shape", { scale: 0, rotate: -90, duration: 0.8, stagger: 0.1, ease: "back.out(2)" }, "-=0.9");
    },
    { scope: root, dependencies: [reduced] },
  );

  /** In-page links scroll smoothly instead of jumping. */
  const go = (event, id) => {
    event.preventDefault();
    scrollToId(id);
  };

  return (
    <section id="top" className="hero" ref={root} aria-label="Introduction">
      <div className="container hero__grid">
        <div className="hero__text">
          <p className="hero__eyebrow mono hero__in">{hero.eyebrow}</p>
          <h1 className="hero__name" aria-label={person.name}>
            {NAME_LINES.map((line) => (
              <span key={line} className="hero__line" aria-hidden="true">
                <span className="hero__line-inner">
                  {reduced || isTouch() ? (
                    line
                  ) : (
                    <VariableProximity label={line} containerRef={root} radius={170} falloff="gaussian"
                      fromFontVariationSettings="'wght' 560" toFontVariationSettings="'wght' 900" />
                  )}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero__fields" aria-label="Cloud, DevOps and AI">
            <span><FieldShape field="cloud" size={30} /> Cloud</span>
            <span><FieldShape field="devops" size={30} /> DevOps</span>
            <span><FieldShape field="ai" size={30} /> AI</span>
          </p>
          <p className="hero__intro hero__in">{hero.intro}</p>
          <div className="hero__ctas hero__in">
            <a className="btn btn--red" href="#work" onClick={(event) => go(event, "work")}>
              See my work <ArrowRightIcon />
            </a>
            <a className="btn" href="#interview" onClick={(event) => go(event, "interview")}>
              Interview me
            </a>
            <a className="link hero__cv" href={person.cv} target="_blank" rel="noreferrer">
              <DownloadIcon /> CV
            </a>
          </div>
          <p className="pill hero__in">
            <span className="pulse" aria-hidden="true" /> {hero.status}
          </p>
        </div>
        <div className="hero__play hero__in">
          <Suspense fallback={<div className="play" />}>
            <Playground reduced={reduced} theme={theme} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
