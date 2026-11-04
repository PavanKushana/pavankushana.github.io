// Playground.jsx: the hero's toy. Bauhaus shapes fall into a frame with real physics (matter-js). With a mouse
// you can grab and throw them; on a phone a tap shakes them. With reduced motion they simply lie still.
// The three big ones carry my fields: the blue circle "cloud", the red square "devops", the yellow triangle "ai".
import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { themeColor } from "../hooks/theme";
import { isTouch } from "../hooks/motion";
import { hero } from "../content";
import "./Playground.css";

const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Query } = Matter;

// the shapes: kind, size as a share of the frame's width, colour (a CSS variable) and an optional word on it
const PIECES = [
  { kind: "circle", size: 0.36, color: "--blue", label: "cloud" },
  { kind: "square", size: 0.3, color: "--red", label: "devops" },
  { kind: "triangle", size: 0.4, color: "--yellow", label: "ai" },
  { kind: "bar", size: 0.62, color: "--ink" },
  { kind: "half", size: 0.32, color: "--ink" },
  { kind: "circle", size: 0.14, color: "--red" },
  { kind: "square", size: 0.13, color: "--blue" },
  { kind: "circle", size: 0.11, color: "--yellow" },
  { kind: "bar", size: 0.36, color: "--blue" },
  { kind: "triangle", size: 0.16, color: "--red" },
];

/** Makes one physics body for a piece, dropped at (x, y), sized to a frame of width w. */
function makeBody({ kind, size, color, label }, x, y, w) {
  const s = size * w;
  const options = { restitution: 0.25, friction: 0.35, density: 0.0015, angle: Math.random() * Math.PI,
    plugin: { color, label } };
  if (kind === "circle") return Bodies.circle(x, y, s / 2, options);
  if (kind === "square") return Bodies.rectangle(x, y, s, s, options);
  if (kind === "bar") return Bodies.rectangle(x, y, s, s * 0.16, options);
  if (kind === "triangle") return Bodies.polygon(x, y, 3, s * 0.58, options);
  // half circle: the arc's points plus the straight edge (it's convex, so matter-js takes it as it is)
  const points = Array.from({ length: 17 }, (_, i) => {
    const a = Math.PI + (i / 16) * Math.PI;
    return { x: Math.cos(a) * (s / 2), y: Math.sin(a) * (s / 2) };
  });
  return Bodies.fromVertices(x, y, [points], options);
}

/** Paints every moving body on the canvas, in the current theme's colours, with the words on the big three. */
function draw(ctx, bodies, colors) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  for (const body of bodies) {
    if (body.isStatic) continue;
    ctx.fillStyle = colors[body.plugin.color];
    ctx.beginPath();
    if (body.circleRadius) ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
    else {
      const [first, ...rest] = body.vertices;
      ctx.moveTo(first.x, first.y);
      rest.forEach((v) => ctx.lineTo(v.x, v.y));
      ctx.closePath();
    }
    ctx.fill();
    if (body.plugin.label) {
      ctx.save();
      ctx.translate(body.position.x, body.position.y);
      ctx.rotate(body.angle);
      ctx.fillStyle = body.plugin.color === "--yellow" ? "#151413" : colors["--on-color"];
      ctx.font = "500 14px 'DM Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(body.plugin.label, 0, body.plugin.color === "--yellow" ? 8 : 0); // a triangle's middle sits low
      ctx.restore();
    }
  }
}

/** reduced: no motion, the shapes are laid out still. theme: redraws in the new colours when it changes. */
export default function Playground({ reduced, theme }) {
  const frame = useRef(null);
  const canvas = useRef(null);
  const world = useRef(null); // { engine, bodies } of the running toy, for the theme redraw and the shake button
  const colors = useRef(null); // the theme's colours, read once per theme instead of every frame

  useEffect(() => {
    const box = frame.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let visible = true;
    let width = 0;
    let cleanupMouse = () => {};

    /** Builds a fresh world sized to the frame: invisible walls, then the shapes dropped from above. */
    const build = () => {
      cleanupMouse();
      width = box.clientWidth;
      const height = box.clientHeight;
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const engine = Engine.create({ gravity: { y: 1.1 } });
      const wall = { isStatic: true, friction: 0.4 };
      const walls = [
        Bodies.rectangle(width / 2, height + 40, width * 3, 80, wall),
        Bodies.rectangle(-40, height / 2, 80, height * 6, wall),
        Bodies.rectangle(width + 40, height / 2, 80, height * 6, wall),
      ];
      const bodies = PIECES.map((piece, i) =>
        makeBody(piece, width * (0.2 + Math.random() * 0.6), -height * 0.25 - i * height * 0.22, width));
      Composite.add(engine.world, [...walls, ...bodies]);

      // with a mouse: grab and throw. The listeners matter-js adds for the wheel and touch are removed, so the
      // page still scrolls over the frame.
      if (!isTouch() && !reduced) {
        const mouse = Mouse.create(cv);
        mouse.element.removeEventListener("wheel", mouse.mousewheel);
        ["touchmove", "touchstart", "touchend"].forEach((type) =>
          mouse.element.removeEventListener(type, type === "touchmove" ? mouse.mousemove : type === "touchstart" ? mouse.mousedown : mouse.mouseup));
        Mouse.setScale(mouse, { x: 1 / dpr, y: 1 / dpr }); // matter-js measures in canvas pixels, the world is in CSS pixels
        const grab = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
        Composite.add(engine.world, grab);
        const onMove = () => {
          const over = Query.point(bodies, mouse.position).length > 0;
          cv.style.cursor = grab.body ? "grabbing" : over ? "grab" : "default";
        };
        cv.addEventListener("mousemove", onMove);
        cleanupMouse = () => {
          cv.removeEventListener("mousemove", onMove);
          cv.removeEventListener("mousemove", mouse.mousemove);
          cv.removeEventListener("mousedown", mouse.mousedown);
          cv.removeEventListener("mouseup", mouse.mouseup);
        };
      }

      if (reduced) {
        // no animation: let the shapes settle out of sight, then paint them once
        for (let i = 0; i < 600; i++) Engine.update(engine, 1000 / 60);
      }
      world.current = { engine, bodies };
    };

    /** One frame: step the physics, paint. Stops while the frame is off screen or the tab is hidden. */
    const loop = () => {
      const { engine, bodies } = world.current;
      Engine.update(engine, 1000 / 60);
      draw(ctx, bodies, colors.current);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(loop);
    };

    colors.current = readColors();
    build();
    if (reduced) draw(ctx, world.current.bodies, colors.current);
    else start();

    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    seen.observe(box);
    const onVisibility = () => !document.hidden && visible && start();
    document.addEventListener("visibilitychange", onVisibility);
    // a real change of width (not just a phone's address bar) builds the world again
    const resized = new ResizeObserver(() => {
      if (Math.abs(box.clientWidth - width) < 40) return;
      build();
      if (reduced) draw(ctx, world.current.bodies, colors.current);
    });
    resized.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      seen.disconnect();
      resized.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      cleanupMouse();
    };
  }, [reduced]);

  // the theme changed: new colours (the running toy uses them on its next frame; a still one paints once more)
  useEffect(() => {
    colors.current = readColors();
    if (reduced && world.current) draw(canvas.current.getContext("2d"), world.current.bodies, colors.current);
  }, [theme, reduced]);

  /** Throws every shape up a little: the phone's way to play, and a button for everyone else. */
  const shake = () => {
    if (!world.current || reduced) return;
    world.current.bodies.forEach((body) => {
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 14, y: -8 - Math.random() * 10 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
    });
  };

  return (
    <div className="play" ref={frame} data-cursor={isTouch() ? undefined : "drag"}>
      <canvas ref={canvas} aria-hidden="true" onClick={isTouch() ? shake : undefined} />
      <p className="play__hint mono" aria-hidden="true">
        {isTouch() ? hero.playHintTouch : hero.playHint}
      </p>
      {!reduced && (
        <button type="button" className="play__shake mono" onClick={shake}>
          Shake
        </button>
      )}
    </div>
  );
}

/** The theme's colours for the canvas (a canvas can't use CSS variables, so they're read as values). */
function readColors() {
  return {
    "--blue": themeColor("--blue"),
    "--red": themeColor("--red"),
    "--yellow": themeColor("--yellow"),
    "--ink": themeColor("--ink"),
    "--on-color": themeColor("--on-color"),
  };
}
