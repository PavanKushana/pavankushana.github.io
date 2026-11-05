// Globe.jsx: a flat Bauhaus globe in SVG (d3-geo, orthographic projection; land outlines from Natural Earth via
// world-atlas). Journey.jsx drives it while you scroll: render(turn, trip) turns the globe from the first place
// to the second (turn 0 to 1) and draws the trip between them (trip 0 to 1). It draws by setting the SVG paths
// directly, so scrolling doesn't re-render React 60 times a second.
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json";
import "./Globe.css";

const LAND = feature(land110, land110.objects.land);
const GRATICULE = geoGraticule10();
const SIZE = 600;
const STEPS = 64; // points along the trip line

/** from, to: { name, coords: [lon, lat] }; start: { turn, trip } to draw first (the scroll may already be past). */
const Globe = forwardRef(function Globe({ from, to, start }, ref) {
  const land = useRef(null);
  const grid = useRef(null);
  const trip = useRef(null);
  const markA = useRef(null);
  const markB = useRef(null);
  const plane = useRef(null);

  const projection = useMemo(() => geoOrthographic().scale(SIZE / 2 - 8).translate([SIZE / 2, SIZE / 2]).clipAngle(90), []);
  const path = useMemo(() => geoPath(projection), [projection]);
  const between = useMemo(() => geoInterpolate(from.coords, to.coords), [from, to]);

  /** Places a marker at its spot, or hides it when it's on the far side of the globe. */
  const place = (el, coords, center) => {
    const front = geoDistance(coords, center) < Math.PI / 2 - 0.05;
    const [x, y] = projection(coords);
    el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    el.style.opacity = front ? "1" : "0";
  };

  /** Draws the globe turned "turn" of the way from the first place to the second, with "tripDone" of the line. */
  const render = (turn, tripDone) => {
    const center = between(turn);
    projection.rotate([-center[0], -center[1] + 8]); // a little tilt, so more of the north shows
    land.current.setAttribute("d", path(LAND) || "");
    grid.current.setAttribute("d", path(GRATICULE) || "");
    const points = Array.from({ length: STEPS + 1 }, (_, i) => between((i / STEPS) * tripDone));
    trip.current.setAttribute("d", tripDone > 0 ? path({ type: "LineString", coordinates: points }) || "" : "");
    place(markA.current, from.coords, center);
    place(markB.current, to.coords, center);
    flyPlane(tripDone, center);
  };

  /** Puts the plane at the front of the trip line, nose pointing along the route. Hidden before take-off and
      after landing, so the still picture shows only the finished line. */
  const flyPlane = (tripDone, center) => {
    const el = plane.current;
    const flying = tripDone > 0.01 && tripDone < 0.985;
    if (!flying) {
      el.style.opacity = "0";
      return;
    }
    const here = between(tripDone);
    const [x, y] = projection(here);
    const [nextX, nextY] = projection(between(Math.min(1, tripDone + 0.01)));
    const angle = (Math.atan2(nextY - y, nextX - x) * 180) / Math.PI + 90; // the icon's nose points up
    el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle.toFixed(1)})`);
    el.style.opacity = geoDistance(here, center) < Math.PI / 2 - 0.05 ? "1" : "0";
  };

  useImperativeHandle(ref, () => ({ render }));
  useEffect(() => {
    render(start.turn, start.trip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="globe" role="img"
      aria-label={`A globe showing the way from ${from.name} to ${to.name}`}>
      <circle className="globe__sea" cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 8} />
      <path className="globe__grid" ref={grid} />
      <path className="globe__land" ref={land} />
      <path className="globe__trip" ref={trip} />
      <circle className="globe__rim" cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 8} />
      <g ref={markA} className="globe__mark">
        <rect x="-9" y="-9" width="18" height="18" className="globe__mark-a" />
        <text x="16" y="5">{from.name}</text>
      </g>
      <g ref={markB} className="globe__mark">
        <circle r="10" className="globe__mark-b" />
        <text x="16" y="5">{to.name}</text>
      </g>
      {/* the plane: Material Design's "flight" icon (Apache 2.0), centred on its own middle */}
      <g ref={plane} className="globe__plane" aria-hidden="true">
        <path transform="scale(2.4) translate(-12 -12)"
          d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </g>
    </svg>
  );
});

export default Globe;
