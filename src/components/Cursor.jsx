// Cursor.jsx: a shape that follows the mouse and becomes the shape of what's under it: a blue circle over cloud
// things, a red square over DevOps, a yellow triangle over AI, a ring over links and buttons, a big "drag"
// circle over the physics frame. Only with a mouse (phones have no cursor), and the normal cursor stays.
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Cursor.css";

export default function Cursor() {
  const follower = useRef(null);
  const [kind, setKind] = useState("none");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    const toX = gsap.quickTo(follower.current, "x", { duration: 0.35, ease: "power3" });
    const toY = gsap.quickTo(follower.current, "y", { duration: 0.35, ease: "power3" });
    const onMove = (event) => {
      toX(event.clientX);
      toY(event.clientY);
    };
    // the nearest thing that changes the cursor: a link or button wins over the card it sits in
    const onOver = (event) => {
      const target = event.target.closest?.("a, button, [data-cursor]");
      setKind(!target ? "dot" : target.matches("a, button") ? "link" : target.dataset.cursor);
    };
    const onLeave = () => setKind("none");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={`cursor cursor--${kind}`} ref={follower} aria-hidden="true">
      <span className="cursor__shape" />
      <span className="cursor__label">drag</span>
    </div>
  );
}
