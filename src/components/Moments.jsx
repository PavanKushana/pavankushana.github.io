// Moments.jsx: a collage of my photos in Bauhaus frames (a rectangle, a circle, an arch), with a few loose
// shapes between them. The frames drift at different speeds as you scroll (parallax). Until the photos are in
// (content.js -> photos), each frame shows which picture goes there.
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Head from "./Head";
import Photo from "./Photo";
import "./Moments.css";

gsap.registerPlugin(ScrollTrigger);

// each frame: which photo, its shape, and how fast it drifts (negative = up, faster than the page)
// (each frame's shape matches the hint in content.js: landscape photos in rectangles, the upright one in the arch)
const FRAMES = [
  { slot: "weimar", shape: "rect", speed: -40 },
  { slot: "campus", shape: "circle", speed: 60 },
  { slot: "hackathon", shape: "rect", speed: -20 },
  { slot: "desk", shape: "arch", speed: 50 },
];

export default function Moments({ reduced }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray(".moment, .moments__deco", root.current).forEach((el) => {
        gsap.fromTo(el, { y: Number(el.dataset.speed) }, {
          y: -Number(el.dataset.speed),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="moments" className="section moments" ref={root}>
      <div className="container">
        <Head num={6} label="Moments" title="India, Germany and in between" />
        <div className="moments__grid">
          {FRAMES.map(({ slot, shape, speed }, i) => (
            <div key={slot} className={`moment moment--${i + 1}`} data-speed={speed}>
              <Photo slot={slot} shape={shape} accent={i} />
            </div>
          ))}
          <span className="moments__deco moments__deco--tri" data-speed="90" aria-hidden="true" />
          <span className="moments__deco moments__deco--bar" data-speed="-70" aria-hidden="true" />
          <span className="moments__deco moments__deco--dot" data-speed="40" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
