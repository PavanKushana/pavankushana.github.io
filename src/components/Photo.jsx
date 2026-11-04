// Photo.jsx: a frame for one picture, cut in a Bauhaus shape (rectangle, circle, arch or half circle).
// With a photo (src set in content.js) it shows the photo in two tones of the theme, in full colour on hover.
// Without one it shows a small composition of shapes, and (while showPhotoLabels is true) which picture goes
// there, so it's clear where to put each one.
import { photos, showPhotoLabels } from "../content";
import "./Photo.css";

// which shapes decorate an empty frame, so frames next to each other don't look the same
const ARTS = ["circle", "square", "triangle"];

/** slot: a key of photos in content.js, or photo: { src, alt, label, hint } directly.
    shape: rect, circle, arch or half. accent: index of the decoration (0-2).
    bare: never write the label (for tiny frames like the chat avatar). */
export default function Photo({ slot, photo, shape = "rect", accent = 0, bare = false, className = "", style }) {
  const item = photo ?? photos[slot];
  const art = ARTS[accent % ARTS.length];
  const labels = showPhotoLabels && !bare;

  return (
    <figure className={`photo photo--${shape} ${className}`} style={style}>
      {item.src ? (
        <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
      ) : (
        <div className="photo__empty" role={labels ? "img" : undefined} aria-label={labels ? `Space for a photo: ${item.label}` : undefined}
          aria-hidden={labels ? undefined : "true"}>
          <span className={`photo__art photo__art--${art}`} />
          {labels && (
            <span className="photo__label">
              <strong>{item.label}</strong>
              {item.hint && <span>{item.hint}</span>}
            </span>
          )}
        </div>
      )}
    </figure>
  );
}
