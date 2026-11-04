// Shape.jsx: the Bauhaus shapes as small SVGs. Each field of my work has one (Kandinsky's pairs):
// cloud = blue circle, devops = red square, ai = yellow triangle; code = black half circle, tools = black bar.

export const FIELD = {
  cloud: { shape: "circle", color: "var(--blue)", label: "Cloud" },
  devops: { shape: "square", color: "var(--red)", label: "DevOps" },
  ai: { shape: "triangle", color: "var(--yellow)", label: "AI" },
  code: { shape: "half", color: "var(--ink)", label: "Code" },
  tools: { shape: "bar", color: "var(--ink)", label: "Tools" },
};

const PATHS = {
  circle: <circle cx="12" cy="12" r="10" />,
  square: <rect x="2.5" y="2.5" width="19" height="19" />,
  triangle: <path d="M12 2.2 22.5 21H1.5z" />,
  half: <path d="M2 18a10 10 0 0 1 20 0z" />,
  bar: <rect x="2" y="9" width="20" height="6" />,
};

/** One shape. kind: circle, square, triangle, half or bar; color: any CSS colour; size in px.
    The colour goes in a CSS variable (--shape), not the fill attribute: CSS variables in SVG attributes don't
    work in every browser, and this way hover styles can still recolour the shape. */
export function Shape({ kind, color = "currentColor", size = 16, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`shape ${className}`} style={{ "--shape": color }}
      aria-hidden="true">
      {PATHS[kind]}
    </svg>
  );
}

/** The shape of a field (cloud, devops, ai, code or tools), in its colour. The black ones get "shape--ink",
    so they can turn paper-coloured on a black background. */
export function FieldShape({ field, size = 16, className = "" }) {
  const { shape, color } = FIELD[field];
  const ink = color === "var(--ink)" ? " shape--ink" : "";
  return <Shape kind={shape} color={color} size={size} className={`${className}${ink}`} />;
}
