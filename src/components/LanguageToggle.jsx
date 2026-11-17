// LanguageToggle.jsx: the EN/DE switch, two square buttons in one ink frame like a Bauhaus label. The language
// that's on is filled in ink. Each button is named in its own language (English, Deutsch), so a visitor finds
// theirs even before reading the page. The words change without a reload (hooks/language.js).
import { useContent, useLanguage } from "../hooks/language";

const CHOICES = [
  { code: "en", short: "EN", name: "English" },
  { code: "de", short: "DE", name: "Deutsch" },
];

/** className: extra class for where it sits (in the top bar or in the phone menu); big: the menu's larger size. */
export default function LanguageToggle({ className = "", big = false }) {
  const { lang, setLanguage } = useLanguage();
  const { ui } = useContent();
  return (
    <div className={`lang${big ? " lang--big" : ""} ${className}`} role="group" aria-label={ui.nav.language}>
      {CHOICES.map(({ code, short, name }) => (
        <button key={code} type="button" lang={code} aria-pressed={lang === code} aria-label={name} title={name}
          onClick={() => setLanguage(code)}>
          {big ? name : short}
        </button>
      ))}
    </div>
  );
}
