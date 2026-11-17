// Journey.jsx: from India to Germany, in chapters. On a computer the section holds still while you scroll
// (pinned): the globe turns from India to Germany, a red line draws the trip with a km counter, and the
// chapters change beside it. On a phone, or with reduced motion, the chapters are a simple list and the globe
// shows the whole trip at once.
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Head from "./Head";
import Photo from "./Photo";
import { Shape } from "./Shape";
import { fill, useContent } from "../hooks/language";
import "./Journey.css";

gsap.registerPlugin(ScrollTrigger);
const Globe = lazy(() => import("./Globe")); // d3 and the map data load only when this section is near

const TRIP = [0.32, 0.54]; // where in the section's scroll the trip happens (as shares of it)
const STILL = { turn: 0.5, trip: 1 }; // the still picture: turned halfway, so both cities and the whole line show
const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

export default function Journey({ reduced }) {
  const { chapters, distanceKm, places, ui } = useContent();
  // the km counter: "6,900 km" in English, "6.900 km" in German. Kept in a ref, because the scroll animation
  // below is set up once and must still use the language that's on now.
  const km = useRef(null);
  km.current = (share) => `${(Math.round((share * distanceKm) / 10) * 10).toLocaleString(ui.numberLocale)} km`;
  const root = useRef(null);
  const globe = useRef(null);
  const counter = useRef(null);
  const view = useRef(STILL); // what the globe shows right now (it may load after the scroll has moved)
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        setPinned(true);
        view.current = { turn: 0, trip: 0 };
        globe.current?.render(0, 0);
        ScrollTrigger.create({
          trigger: ".journey__stage",
          start: "top top",
          end: `+=${chapters.length * 80}%`,
          pin: true,
          onUpdate: ({ progress }) => {
            const share = easeInOut(Math.min(1, Math.max(0, (progress - TRIP[0]) / (TRIP[1] - TRIP[0]))));
            view.current = { turn: share, trip: share };
            globe.current?.render(share, share);
            if (counter.current) counter.current.textContent = km.current(share);
            setActive(Math.min(chapters.length - 1, Math.floor(progress * chapters.length)));
          },
        });
        // back to the still picture when the screen gets small or motion is turned off
        return () => {
          setPinned(false);
          view.current = STILL;
          globe.current?.render(STILL.turn, STILL.trip);
          if (counter.current) counter.current.textContent = km.current(1);
        };
      });
      // phones and small tablets: the section isn't pinned, but the trip (and the plane) still follows the scroll
      // while the globe passes through the screen
      media.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        view.current = { turn: 0, trip: 0 };
        globe.current?.render(0, 0);
        if (counter.current) counter.current.textContent = km.current(0);
        ScrollTrigger.create({
          trigger: ".journey__globe",
          start: "top 85%",
          end: "bottom 35%",
          scrub: true,
          onUpdate: ({ progress }) => {
            const share = easeInOut(progress);
            view.current = { turn: share, trip: share };
            globe.current?.render(share, share);
            if (counter.current) counter.current.textContent = km.current(share);
          },
        });
        return () => {
          view.current = STILL;
          globe.current?.render(STILL.turn, STILL.trip);
          if (counter.current) counter.current.textContent = km.current(1);
        };
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  // switching between the stage and the list changes the page's height: every scroll position is measured again
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pinned]);

  // the language changed: write the km counter again in the new number format, at the point the trip is at now
  useEffect(() => {
    if (counter.current) counter.current.textContent = km.current(view.current.trip);
  }, [ui]);

  return (
    <section id="journey" className={`section journey${pinned ? " journey--pinned" : ""}`} ref={root}>
      <div className="container">
        <Head num={2} label={ui.journey.label} title={ui.journey.title} />
      </div>
      <div className="journey__stage">
        <div className="container journey__grid">
          <div className="journey__globe">
            <Suspense fallback={<div className="journey__globe-wait" />}>
              <Globe ref={globe} from={places.india} to={places.germany} start={view.current}
                label={fill(ui.journey.globe, { from: places.india.name, to: places.germany.name })} />
            </Suspense>
            <p className="journey__km mono">
              <span ref={counter}>{km.current(pinned ? 0 : 1)}</span>
              <span className="journey__km-label">{ui.journey.kmLabel}</span>
            </p>
          </div>

          <ol className="journey__chapters">
            {chapters.map(({ year, place, title, text, photo }, i) => (
              <li key={i} className={`chapter${i === active ? " is-active" : ""}`} aria-current={pinned && i === active ? "step" : undefined}>
                <p className="chapter__year">{year}</p>
                <p className="chapter__place mono">
                  <Shape kind={place === "germany" ? "circle" : "square"} color={place === "germany" ? "var(--blue)" : "var(--red)"} size={14} />
                  {places[place].name}
                </p>
                <h3 className="chapter__title">{title}</h3>
                <p className="chapter__text">{text}</p>
                {photo && <Photo slot={photo} accent={i} className="chapter__photo" />}
              </li>
            ))}
          </ol>

          {pinned && (
            <ol className="journey__steps" aria-hidden="true">
              {chapters.map(({ year }, i) => (
                <li key={i} className={i <= active ? "is-done" : ""}>
                  <span />
                  {year}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
