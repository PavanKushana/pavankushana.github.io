// Footer.jsx: the last line: the three shapes, copyright, where it's made, how it was built, back to the top.
import { person } from "../content";
import { scrollToId } from "../hooks/motion";
import { Shape } from "./Shape";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__shapes" aria-hidden="true">
          <Shape kind="circle" color="var(--blue)" size={18} />
          <Shape kind="square" color="var(--red)" size={18} />
          <Shape kind="triangle" color="var(--yellow)" size={18} />
        </p>
        <p>
          © {new Date().getFullYear()} {person.name}. Made in Weimar, where the Bauhaus began.
        </p>
        <p className="footer__built">
          Built with React, GSAP, Lenis, matter-js and d3-geo, with help from Claude Code. Effects from React Bits.
        </p>
        <button type="button" className="footer__top" onClick={() => scrollToId("top")}>
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}
