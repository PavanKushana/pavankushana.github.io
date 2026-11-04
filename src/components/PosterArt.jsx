// PosterArt.jsx: the artwork on each exhibition poster, drawn in SVG with the site's shapes and colours (colour
// classes from global.css, so both themes work). Each one tells its project in shapes, and moves a little
// (CSS animations in Exhibition.css):
// - Lifeguard-Agent: a cloud, three containers, the AI triangle, and an alert dot inside a turning watch ring
// - Debate Arena: two speakers (half circles) facing each other, arguments flying between them, a judge on top
// - Data centers: a network of nodes, with the cheapest route drawing itself
// - Next: a rising triangle and the steps still to climb

const Lifeguard = () => (
  <svg viewBox="0 0 300 300" className="art art--lifeguard" aria-hidden="true">
    <circle className="fill-blue" cx="96" cy="92" r="70" />
    <circle className="art__ring stroke-ink" cx="168" cy="178" r="96" fill="none" strokeWidth="5" strokeDasharray="28 14" />
    <g className="art__boxes">
      <rect className="fill-red" x="112" y="150" width="34" height="34" />
      <rect className="fill-red" x="152" y="150" width="34" height="34" />
      <rect className="fill-red" x="192" y="150" width="34" height="34" />
    </g>
    <path className="fill-yellow" d="M232 64 278 146H186z" />
    <rect className="fill-ink" x="34" y="228" width="170" height="14" />
    <circle className="art__alert fill-red" cx="242" cy="236" r="13" />
  </svg>
);

const Debate = () => (
  <svg viewBox="0 0 300 300" className="art art--debate" aria-hidden="true">
    {/* the speakers: flat sides at the edges, round sides facing each other */}
    <path className="fill-blue" d="M40 90a80 80 0 0 1 0 160z" />
    <path className="fill-ink" d="M260 90a80 80 0 0 0 0 160z" />
    <path className="fill-yellow" d="M150 28 196 108H104z" />
    <rect className="art__arg art__arg--1 fill-red" x="70" y="160" width="22" height="22" />
    <rect className="art__arg art__arg--2 fill-red" x="70" y="200" width="16" height="16" />
    <rect className="fill-ink" x="96" y="262" width="108" height="10" />
  </svg>
);

const NODES = [[52, 70], [128, 48], [214, 74], [88, 150], [172, 138], [248, 160], [60, 236], [150, 222], [236, 246]];
const LINKS = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8], [1, 3]];
const ROUTE = [0, 3, 4, 7, 8];
const DataCenters = () => (
  <svg viewBox="0 0 300 300" className="art art--network" aria-hidden="true">
    {LINKS.map(([a, b]) => (
      <line key={`${a}-${b}`} className="stroke-line" x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} strokeWidth="3" />
    ))}
    <polyline className="art__route stroke-red" points={ROUTE.map((i) => NODES[i].join(",")).join(" ")} fill="none"
      strokeWidth="7" pathLength="100" />
    {NODES.map(([x, y], i) => (
      <circle key={i} className={ROUTE.includes(i) ? "fill-blue" : "fill-ink"} cx={x} cy={y} r={ROUTE.includes(i) ? 17 : 12} />
    ))}
  </svg>
);

const Next = () => (
  <svg viewBox="0 0 300 300" className="art art--next" aria-hidden="true">
    <rect className="fill-ink" x="40" y="226" width="220" height="16" />
    <rect className="fill-ink" x="70" y="186" width="160" height="16" opacity="0.6" />
    <rect className="fill-ink" x="100" y="146" width="100" height="16" opacity="0.3" />
    <path className="art__rise fill-yellow" d="M150 36 214 130H86z" />
    <circle className="fill-blue" cx="236" cy="70" r="20" />
  </svg>
);

const ARTS = { lifeguard: Lifeguard, debate: Debate, datacenters: DataCenters, next: Next };

/** The poster art for a project id (lifeguard, debate, datacenters or next). */
export default function PosterArt({ id }) {
  const Art = ARTS[id];
  return <Art />;
}
