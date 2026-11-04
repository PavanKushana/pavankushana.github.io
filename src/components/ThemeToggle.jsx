// ThemeToggle.jsx: the light/dark switch. A yellow sun with rays by day; at night a circle slides over it and
// leaves a crescent moon. The page itself switches with a circle growing out of this button (theme.js).

/** theme: "light" or "dark"; onToggle: switches it (gets the click, for where the circle starts). */
export default function ThemeToggle({ theme, onToggle }) {
  const dark = theme === "dark";
  return (
    <button type="button" className={`toggle${dark ? " toggle--dark" : ""}`} onClick={onToggle}
      aria-label={dark ? "Switch to the light theme" : "Switch to the dark theme"}
      title={dark ? "Light theme" : "Dark theme"}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <mask id="toggle-cut">
          <rect width="32" height="32" fill="#fff" />
          <circle className="toggle__cut" cx="22" cy="11" r="8" fill="#000" />
        </mask>
        <g className="toggle__rays">
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="15" y="1.5" width="2" height="5" transform={`rotate(${i * 45} 16 16)`} />
          ))}
        </g>
        <circle className="toggle__body" cx="16" cy="16" r="8" mask="url(#toggle-cut)" />
      </svg>
    </button>
  );
}
