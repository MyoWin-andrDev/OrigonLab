import { ProjectCategory } from "@/lib/types";

/**
 * Stylised UI mockup used until real project imagery exists.
 *
 * This is deliberately a wireframe, not a fake screenshot: it communicates
 * *what kind of thing* the project is — a website or a mobile app — without
 * pretending to show work that hasn't been photographed yet.
 *
 * Drawn in SVG so it stays crisp at any card size, and painted in translucent
 * white so it reads over whatever gradient sits behind it.
 */

interface ContextMockupProps {
  category: ProjectCategory;
  /** Varies the composition so sibling cards don't look identical. */
  seed?: number;
}

const INK = "rgba(255,255,255,0.92)";
const SOFT = "rgba(255,255,255,0.55)";
const FAINT = "rgba(255,255,255,0.28)";
const PANE = "rgba(255,255,255,0.10)";

function BrowserMockup({ seed = 0 }: { seed?: number }) {
  // Two column rhythms so a row of website cards doesn't repeat exactly.
  const cols = seed % 2 === 0 ? 3 : 2;
  const colW = cols === 3 ? 82 : 130;
  const gap = 14;
  const startX = 52 + (cols === 3 ? 0 : 6);

  return (
    <svg
      viewBox="0 0 400 500"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Window */}
      <rect x="40" y="96" width="320" height="308" rx="12" fill={PANE} />
      <rect
        x="40"
        y="96"
        width="320"
        height="308"
        rx="12"
        fill="none"
        stroke={FAINT}
        strokeWidth="1.5"
      />

      {/* Chrome bar */}
      <line x1="40" y1="126" x2="360" y2="126" stroke={FAINT} strokeWidth="1.5" />
      <circle cx="58" cy="111" r="3.5" fill={SOFT} />
      <circle cx="70" cy="111" r="3.5" fill={FAINT} />
      <circle cx="82" cy="111" r="3.5" fill={FAINT} />
      <rect x="150" y="106" width="100" height="10" rx="5" fill={FAINT} />

      {/* Hero */}
      <rect x="52" y="142" width="180" height="13" rx="6.5" fill={INK} />
      <rect x="52" y="163" width="132" height="13" rx="6.5" fill={SOFT} />
      <rect x="52" y="192" width="64" height="20" rx="10" fill={INK} />

      {/* Content row */}
      {Array.from({ length: cols }).map((_, i) => (
        <g key={i}>
          <rect
            x={startX + i * (colW + gap)}
            y="238"
            width={colW}
            height={cols === 3 ? 74 : 84}
            rx="8"
            fill={FAINT}
          />
          <rect
            x={startX + i * (colW + gap)}
            y={cols === 3 ? 322 : 332}
            width={colW - 20}
            height="8"
            rx="4"
            fill={SOFT}
          />
        </g>
      ))}

      {/* Footer lines */}
      <rect x="52" y="360" width="296" height="7" rx="3.5" fill={FAINT} />
      <rect x="52" y="375" width="200" height="7" rx="3.5" fill={FAINT} />
    </svg>
  );
}

function PhoneMockup({ seed = 0 }: { seed?: number }) {
  // Alternate between a feed layout and a card layout.
  const feed = seed % 2 === 0;

  return (
    <svg
      viewBox="0 0 400 500"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Device */}
      <rect x="139" y="72" width="122" height="356" rx="22" fill={PANE} />
      <rect
        x="139"
        y="72"
        width="122"
        height="356"
        rx="22"
        fill="none"
        stroke={FAINT}
        strokeWidth="1.5"
      />
      {/* Notch */}
      <rect x="180" y="80" width="40" height="7" rx="3.5" fill={FAINT} />

      {/* Header */}
      <rect x="152" y="102" width="52" height="9" rx="4.5" fill={INK} />
      <rect x="152" y="117" width="34" height="7" rx="3.5" fill={SOFT} />

      {feed ? (
        <>
          {/* Feature card */}
          <rect x="152" y="136" width="96" height="60" rx="8" fill={FAINT} />
          {/* Feed rows */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="152" y={210 + i * 34} width="24" height="24" rx="7" fill={SOFT} />
              <rect x="184" y={215 + i * 34} width="64" height="7" rx="3.5" fill={INK} />
              <rect x="184" y={226 + i * 34} width="42" height="6" rx="3" fill={FAINT} />
            </g>
          ))}
        </>
      ) : (
        <>
          {/* Card grid */}
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={152 + (i % 2) * 50}
              y={140 + Math.floor(i / 2) * 62}
              width="46"
              height="56"
              rx="8"
              fill={i === 0 ? SOFT : FAINT}
            />
          ))}
          <rect x="152" y="272" width="96" height="7" rx="3.5" fill={INK} />
          <rect x="152" y="286" width="70" height="6" rx="3" fill={FAINT} />
          <rect x="152" y="304" width="96" height="30" rx="8" fill={FAINT} />
        </>
      )}

      {/* Tab bar */}
      <line x1="139" y1="392" x2="261" y2="392" stroke={FAINT} strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={161 + i * 26} cy="408" r="4" fill={i === 0 ? INK : FAINT} />
      ))}
    </svg>
  );
}

export default function ContextMockup({ category, seed = 0 }: ContextMockupProps) {
  return category === "mobile" ? (
    <PhoneMockup seed={seed} />
  ) : (
    <BrowserMockup seed={seed} />
  );
}
