// theme.js: light ("paper") and dark ("night"). The site always opens in light (index.html sets it, Pavan's
// choice); the switch changes the theme for the current visit only, so it isn't saved. Switching is animated
// as a circle growing from the button, with the View Transitions API where the browser has it, and an instant
// switch where it doesn't (or with reduced motion).
import { useCallback, useState } from "react";
import { flushSync } from "react-dom";

const current = () => document.documentElement.dataset.theme || "light";

/** The theme and a function to switch it. */
export function useTheme() {
  const [theme, setTheme] = useState(current);

  /** Switches theme. event: the click, so the circle starts where the button is. */
  const toggle = useCallback((event) => {
    const next = current() === "dark" ? "light" : "dark";
    const apply = () => {
      document.documentElement.dataset.theme = next;
      flushSync(() => setTheme(next)); // React updates inside the transition's "after" snapshot
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }
    const rect = event?.currentTarget?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }, []);

  return { theme, toggle };
}

/** Reads a colour from the current theme (for canvases, which can't use CSS variables directly). */
export function themeColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
