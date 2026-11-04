// motion.js: everything about movement in one place. It decides whether the page animates at all (visitors can
// ask their system for less motion), runs the smooth scrolling, and scrolls to sections.
import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED = "(prefers-reduced-motion: reduce)";

/** True when the visitor asked their system for less motion. Follows changes while the page is open. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED).matches);
  useEffect(() => {
    const media = window.matchMedia(REDUCED);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** True on phones and tablets (no mouse): some effects switch to tap instead of hover or drag. */
export const isTouch = () => !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// the one smooth-scroll instance, shared with the nav, the menu and the case study panel
let lenis = null;

/** Starts Lenis smooth scrolling, driven by GSAP's clock so the scroll animations stay in step with it. */
export function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
    };
  }, [enabled]);
}

/** Scrolls to a section by its id ("top" = the very top), smoothly when Lenis runs. */
export function scrollToId(id) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  if (lenis) lenis.scrollTo(target, { offset: id === "top" ? 0 : -72, duration: 1.3 });
  else if (target === 0) window.scrollTo({ top: 0 });
  else target.scrollIntoView();
}

/** Stops or restarts page scrolling (while the phone menu or a case study is open). */
export function pauseScroll(paused) {
  document.body.style.overflow = paused ? "hidden" : "";
  if (paused) lenis?.stop();
  else lenis?.start();
}
