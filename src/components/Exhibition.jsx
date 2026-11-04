// Exhibition.jsx: my work as an exhibition, a nod to the Bauhaus show in Weimar in 1923. Each project is a
// poster. On a computer the row of posters slides sideways while you scroll down (the section holds still);
// on a phone you swipe it. A poster's button opens its case study.
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Head from "./Head";
import PosterArt from "./PosterArt";
import CaseStudy from "./CaseStudy";
import { FieldShape } from "./Shape";
import { nextUp, projects } from "../content";
import { ArrowRightIcon } from "./Icons";
import "./Exhibition.css";

gsap.registerPlugin(ScrollTrigger);

export default function Exhibition({ reduced }) {
  const root = useRef(null);
  const [open, setOpen] = useState(null); // the id of the project whose case study is open

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current.querySelector(".expo__track");
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".expo__stage",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true, // measure again after a resize
          },
        });
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  const project = projects.find(({ id }) => id === open);

  return (
    <section id="work" className="section expo" ref={root}>
      <div className="container">
        <Head num={3} label="Work" title="An exhibition of my work" />
      </div>

      <div className="expo__stage" data-lenis-prevent-horizontal>
        <div className="expo__track">
          <div className="expo__intro">
            <p>Three projects, from my B.Tech to a hackathon. Each poster opens the whole story.</p>
            <p className="expo__hint mono" aria-hidden="true">
              <span className="expo__hint-scroll">Keep scrolling</span>
              <span className="expo__hint-swipe">Swipe</span> <ArrowRightIcon />
            </p>
          </div>

          {projects.map(({ id, title, year, tagline, fields }, i) => (
            <article key={id} className={`poster poster--${id}`} data-cursor={fields[0]}>
              <span className="poster__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div className="poster__art">
                <PosterArt id={id} />
              </div>
              <div className="poster__body">
                <p className="poster__meta mono">
                  {year}
                  <span className="poster__fields">
                    {fields.map((field) => <FieldShape key={field} field={field} size={13} />)}
                  </span>
                </p>
                <h3 className="poster__title">{title}</h3>
                <p className="poster__tagline">{tagline}</p>
                <button type="button" className="btn btn--small poster__open" onClick={() => setOpen(id)}>
                  Open the case study <ArrowRightIcon />
                </button>
              </div>
            </article>
          ))}

          <article className="poster poster--next">
            <span className="poster__num" aria-hidden="true">→</span>
            <div className="poster__art">
              <PosterArt id="next" />
            </div>
            <div className="poster__body">
              <p className="poster__meta mono">Now</p>
              <h3 className="poster__title">{nextUp.title}</h3>
              <ul className="poster__list">
                {nextUp.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>

      {project && <CaseStudy project={project} reduced={reduced} onClose={() => setOpen(null)} />}
    </section>
  );
}
