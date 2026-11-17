// Footer.jsx: the last line: the three shapes, copyright, how it was built, back to the top.
import { useContent } from "../hooks/language";
import { scrollToId } from "../hooks/motion";
import { Shape } from "./Shape";
import "./Footer.css";

export default function Footer() {
  const { person, ui } = useContent();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__shapes" aria-hidden="true">
          <Shape kind="circle" color="var(--blue)" size={18} />
          <Shape kind="square" color="var(--red)" size={18} />
          <Shape kind="triangle" color="var(--yellow)" size={18} />
        </p>
        <p>
          © {new Date().getFullYear()} {person.name}
        </p>
        <p className="footer__built">
          {ui.footer.built}
        </p>
        <button type="button" className="footer__top" onClick={() => scrollToId("top")}>
          {ui.footer.top}
        </button>
      </div>
    </footer>
  );
}
