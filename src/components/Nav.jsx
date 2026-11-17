// Nav.jsx: the top bar. The three shapes as the logo, the sections, the language switch (EN/DE), the theme
// switch and the CV. It gets a paper (or night) background with a rule once you scroll, marks the section
// you're reading, and on phones folds the links into a full-screen menu. On small phones the language switch
// moves into that menu too, because the bar has no room left.
// The menu is drawn straight into <body> (a portal), not inside the bar: the bar's entrance animation and its
// blur make it the frame for anything "fixed" inside it, so the menu used to be squeezed into the bar's 74px and
// the page showed through (17 Nov 2026, also on the live site before this fix).
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "../hooks/language";
import { pauseScroll, scrollToId } from "../hooks/motion";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { Shape } from "./Shape";
import { CloseIcon, DownloadIcon, MenuIcon } from "./Icons";
import "./Nav.css";

// the menu's links each get one of the shapes, in turn
const MENU_SHAPES = [["circle", "var(--blue)"], ["square", "var(--red)"], ["triangle", "var(--yellow)"]];

export default function Nav({ theme, onToggleTheme }) {
  const { nav, person, ui } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // the section crossing the middle of the screen is the active one (the ids are the same in both languages)
  useEffect(() => {
    const sections = nav.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the phone menu stops the page scrolling behind it; Escape closes it
  useEffect(() => {
    pauseScroll(open);
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Goes to a section and closes the phone menu. */
  const go = (event, id) => {
    event.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  // the CV is in English: in German the CV buttons say so when you point at them
  const cvTitle = ui.nav.cvTitle || undefined;

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" onClick={(event) => go(event, "top")} aria-label={ui.nav.backToTop}>
          <span className="nav__logo" aria-hidden="true">
            <Shape kind="circle" color="var(--blue)" size={15} />
            <Shape kind="square" color="var(--red)" size={15} />
            <Shape kind="triangle" color="var(--yellow)" size={15} />
          </span>
          <span className="nav__name">Pavan Kushana</span>
        </a>
        <nav className="nav__links" aria-label={ui.nav.sections}>
          {nav.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={(event) => go(event, id)} className={active === id ? "is-active" : ""}
              aria-current={active === id ? "true" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav__end">
          <LanguageToggle className="nav__lang" />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <a className="btn btn--small btn--solid nav__cv" href={person.cv} target="_blank" rel="noreferrer" title={cvTitle}>
            <DownloadIcon /> {ui.nav.cv}
          </a>
          <button type="button" className="nav__menu" onClick={() => setOpen(!open)} aria-expanded={open}
            aria-controls="menu" aria-label={open ? ui.nav.closeMenu : ui.nav.openMenu}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {createPortal(
        <div id="menu" className={`nav__sheet${open ? " is-open" : ""}`} inert={!open}>
          {nav.map(({ id, label }, i) => (
            <a key={id} href={`#${id}`} onClick={(event) => go(event, id)} style={{ "--i": i }}>
              <Shape kind={MENU_SHAPES[i % 3][0]} color={MENU_SHAPES[i % 3][1]} size={22} />
              {label}
            </a>
          ))}
          <a className="btn btn--solid" href={person.cv} target="_blank" rel="noreferrer" style={{ "--i": nav.length }}>
            <DownloadIcon /> {ui.nav.downloadCv}
          </a>
          <div className="nav__sheet-lang" style={{ "--i": nav.length + 1 }}>
            <LanguageToggle big />
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}
