// About.jsx: who I am. My portrait in an arch, the short story, then the three shapes (Kandinsky's pairs, one
// per field of my work) that draw themselves, and the four habits I work by.
import Head from "./Head";
import Photo from "./Photo";
import { useContent } from "../hooks/language";
import "./About.css";

/** A big shape that first draws its outline, then fills (when its card scrolls in; see .is-in in App.jsx). */
function DrawnShape({ kind }) {
  const common = { pathLength: 100, className: "drawn__path" };
  return (
    <svg viewBox="0 0 120 120" className={`drawn drawn--${kind}`} aria-hidden="true">
      {kind === "circle" && <circle cx="60" cy="60" r="54" {...common} />}
      {kind === "square" && <rect x="8" y="8" width="104" height="104" {...common} />}
      {kind === "triangle" && <path d="M60 6 116 112H4z" {...common} />}
    </svg>
  );
}

export default function About() {
  const { about, shapes, ui } = useContent();
  // The lists use their position as React key, not their text: when the language changes, the same elements stay
  // and only their words change, so the fade-in animation (App.jsx) doesn't lose them.
  return (
    <section id="about" className="section about">
      <div className="container">
        <Head num={1} label={ui.about.label} title={about.title} />

        <div className="about__intro">
          <Photo slot="portrait" shape="arch" accent={0} className="about__portrait" />
          <div className="about__text">
            {about.paragraphs.map((paragraph, i) => (
              <p key={i} data-reveal>
                {paragraph}
              </p>
            ))}
            <p className="about__note" data-reveal>
              {shapes.note}
            </p>
          </div>
        </div>

        <ul className="fields">
          {shapes.fields.map(({ id, shape, title, text }) => (
            <li key={id} className={`field field--${id}`} data-reveal data-cursor={id}>
              <DrawnShape kind={shape} />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>

        <div className="habits">
          <h3 className="habits__title" data-reveal>
            {ui.about.habitsTitle}
          </h3>
          <ol className="habits__list">
            {about.habits.map(({ title, text }, i) => (
              <li key={i} data-reveal>
                <span className="habits__num">{String(i + 1).padStart(2, "0")}</span>
                <h4>{title}</h4>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
