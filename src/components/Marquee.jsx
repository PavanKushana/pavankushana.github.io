// Marquee.jsx: a black band with my three fields and their shapes, running sideways. It speeds up while you
// scroll and turns around when you scroll back up.
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useContent } from "../hooks/language";
import { Shape } from "./Shape";
import "./Marquee.css";

gsap.registerPlugin(ScrollTrigger);

// the shape and colour after each word; the words themselves are ui.marquee in content.js (same order)
const SHAPES = [
  ["circle", "var(--blue)"],
  ["square", "var(--red)"],
  ["triangle", "var(--yellow)"],
  ["half", "var(--bg)"],
  ["bar", "var(--bg)"],
];

export default function Marquee({ reduced }) {
  const { ui } = useContent();
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced) return;
      const track = root.current.querySelector(".marquee__track");
      // the track holds the list twice; moving it by half its width and starting over loops without a seam
      const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      loop.totalTime(28 * 50); // start well into the loop, so running it backwards never hits the beginning
      let direction = 1;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          if (velocity !== 0) direction = velocity > 0 ? 1 : -1;
          // a short burst of speed in the scroll's direction, easing back to the calm pace
          gsap.to(loop, { timeScale: direction * Math.min(1 + Math.abs(velocity) / 400, 5), duration: 0.25, overwrite: true });
          gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.25, overwrite: false });
        },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    // the outer box clips the tilted band, so it can't make the page wider than the screen
    <div className="marquee-clip" aria-hidden="true">
    <div className="marquee" ref={root}>
      <div className="marquee__track">
        {[0, 1].map((copy) =>
          ui.marquee.map((word, i) => (
            <span key={`${copy}-${i}`} className="marquee__item">
              {word} <Shape kind={SHAPES[i][0]} color={SHAPES[i][1]} size={34} />
            </span>
          )),
        )}
      </div>
    </div>
    </div>
  );
}
