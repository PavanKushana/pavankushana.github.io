// Head.jsx: how every section starts, like a Bauhaus poster: a huge number, a small label and the title, on a
// thick rule that draws itself across the first time it scrolls into view.

/** num: the section number; label: the small word; title: the heading. */
export default function Head({ num, label, title }) {
  return (
    <div className="head" data-reveal>
      <span className="head__num" aria-hidden="true">
        {String(num).padStart(2, "0")}
      </span>
      <p className="head__label">{label}</p>
      <h2 className="head__title">{title}</h2>
    </div>
  );
}
