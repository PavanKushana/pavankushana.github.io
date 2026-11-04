// App.jsx: the page from top to bottom. Each section is its own component; all the words come from content.js.
// This file also holds the theme (light/dark) and runs the one animation every section shares: parts marked
// data-reveal fade up the first time they scroll into view, and get the class "is-in" (headings draw their
// rule, shapes draw their outline).
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion, useSmoothScroll } from "./hooks/motion";
import { useTheme } from "./hooks/theme";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Journey from "./components/Journey";
import Exhibition from "./components/Exhibition";
import Skills from "./components/Skills";
import Interview from "./components/Interview";
import Moments from "./components/Moments";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function App() {
  const reduced = useReducedMotion();
  const { theme, toggle } = useTheme();
  const root = useRef(null);
  useSmoothScroll(!reduced);

  useGSAP(
    () => {
      document.documentElement.classList.toggle("js-motion", !reduced);
      if (reduced) return;
      const items = gsap.utils.toArray("[data-reveal]");
      gsap.set(items, { opacity: 0, y: 34 });
      // a few at a time, so a row of cards comes in one after another
      ScrollTrigger.batch(items, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((item) => item.classList.add("is-in"));
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, overwrite: true });
        },
      });
      // the fonts change line lengths when they arrive: measure the scroll positions again then
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {!reduced && <Cursor />}
      <Nav theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero reduced={reduced} theme={theme} />
        <Marquee reduced={reduced} />
        <About />
        <Journey reduced={reduced} />
        <Exhibition reduced={reduced} />
        <Skills reduced={reduced} />
        <Interview reduced={reduced} />
        <Moments reduced={reduced} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
