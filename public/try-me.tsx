import { motion } from "motion/react";

const PATHS: string[] = [
  "M2242 1800 c-92 -24 -92 -24 -92 -65 0 -28 13 -47 82 -120 90 -96 115 -114 124 -91 3 8 -17 45 -45 84 l-50 70 72 -19 c106 -30 157 -55 205 -102 172 -166 160 -503 -26 -747 -50 -65 -157 -172 -222 -222 -27 -20 -32 -29 -23 -38 17 -18 80 0 150 42 66 39 175 153 222 232 77 129 113 302 91 448 -34 235 -136 362 -350 434 l-55 18 51 7 c56 7 105 27 111 45 2 7 -3 19 -12 28 -23 22 -139 20 -233 -4z",
  "M208 853 c-11 -3 -18 -14 -18 -28 0 -13 -3 -31 -7 -41 -5 -13 -3 -15 7 -9 10 6 11 0 5 -31 -10 -55 -21 -64 -76 -64 -27 0 -49 -4 -49 -8 0 -15 34 -39 63 -46 15 -4 26 -10 23 -14 -2 -4 -9 -68 -16 -142 -9 -109 -8 -144 2 -179 7 -25 18 -46 24 -48 6 -2 25 9 42 23 28 25 31 32 26 68 -3 23 -1 66 6 96 6 30 11 65 11 78 -1 12 4 22 10 22 5 0 8 4 5 8 -9 15 14 97 31 110 9 6 32 12 50 12 31 0 32 -1 22 -27 -17 -44 -24 -234 -10 -275 10 -30 16 -35 34 -31 12 3 27 10 34 15 12 9 46 115 57 178 8 43 119 165 142 156 20 -8 18 21 -3 33 -21 11 -52 0 -100 -37 l-37 -27 7 24 c6 25 -16 90 -34 102 -24 14 -48 -5 -68 -53 -18 -44 -24 -50 -43 -44 -13 3 -31 6 -40 6 -15 0 -16 9 -11 68 3 48 1 72 -9 84 -14 19 -53 29 -80 21z",
  "M1353 818 c-47 -57 -95 -418 -74 -547 13 -77 30 -101 55 -76 9 9 16 23 16 31 0 8 10 34 21 57 20 38 42 118 54 192 3 17 11 35 18 40 8 6 12 15 10 21 -2 6 3 17 12 24 8 7 15 9 15 5 0 -5 8 -1 18 9 18 16 19 13 14 -62 -3 -62 -1 -80 11 -91 29 -23 51 -8 72 49 26 70 48 110 73 133 19 18 20 17 24 -80 3 -67 10 -108 22 -131 21 -41 40 -37 43 9 2 19 8 71 14 117 10 71 9 87 -5 117 -14 29 -22 35 -47 35 -32 0 -77 -40 -105 -92 -21 -39 -25 -35 -19 20 6 58 -11 85 -54 85 -37 0 -54 -14 -97 -78 -30 -43 -34 -46 -34 -25 0 14 7 58 17 97 16 71 16 74 -3 110 -21 40 -53 54 -71 31z",
  "M861 753 c-18 -40 -133 -243 -140 -247 -3 -2 -5 33 -3 78 4 90 -6 110 -44 96 -43 -16 -81 -206 -52 -259 35 -65 85 -49 163 52 30 39 55 63 55 55 0 -35 -64 -229 -101 -306 -43 -90 -63 -105 -114 -91 -44 13 -48 12 -40 -18 10 -42 40 -67 78 -66 68 2 137 56 163 126 9 23 20 51 24 62 5 11 12 36 16 55 3 19 19 73 35 120 17 50 31 118 35 165 3 44 10 95 14 113 10 39 -1 76 -25 86 -32 12 -52 6 -64 -21z",
  "M1949 715 c-73 -47 -134 -183 -132 -292 1 -77 33 -150 69 -159 74 -19 156 41 193 141 33 87 25 86 -33 -1 -70 -105 -97 -118 -116 -58 -15 45 -7 78 24 92 32 14 53 47 82 128 26 70 31 143 12 162 -18 18 -59 13 -99 -13z m42 -103 c-11 -23 -26 -44 -32 -47 -5 -4 1 16 16 45 14 29 29 50 31 47 3 -3 -4 -23 -15 -45z",
];

// Timing constants (seconds)
const DRAW_DURATION = 0.6;
const STAGGER = 0.1;
const HOLD = 0.4;
const ERASE_DURATION = 0.4;
const ERASE_STAGGER = 0.1;
const PAUSE = 0.5;

const N = PATHS.length;
const totalDraw = DRAW_DURATION + STAGGER * (N - 1);
const totalErase = ERASE_DURATION + ERASE_STAGGER * (N - 1);
const CYCLE = totalDraw + HOLD + totalErase + PAUSE;

interface AnimatedPathProps {
  d: string;
  fill: string;
  index: number;
}

function AnimatedPath({ d, index, fill }: AnimatedPathProps) {
  const drawStart = (STAGGER * index) / CYCLE;
  const drawEnd = drawStart + DRAW_DURATION / CYCLE;
  const eraseStart =
    (totalDraw + HOLD + ERASE_STAGGER * (N - 1 - index)) / CYCLE;
  const eraseEnd = eraseStart + ERASE_DURATION / CYCLE;

  return (
    <motion.path
      animate={{
        fillOpacity: [0, 0, 1, 1, 0, 0],
        scale: [0.985, 0.985, 1, 1, 0.985, 0.985],
      }}
      d={d}
      fill={fill}
      initial={{ fillOpacity: 0, scale: 0.985 }}
      transition={{
        duration: CYCLE,
        times: [0, drawStart, drawEnd, eraseStart, eraseEnd, 1],
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  );
}

interface WritingLogoProps {
  /** Additional CSS class names */
  className?: string;
  /** Fill color — defaults to currentColor */
  stroke?: string;
  /** SVG width in px — height is derived from the 3:2 aspect ratio */
  width?: number;
}

export default function WritingLogo({
  stroke = "currentColor",
  width = 300,
  className,
}: WritingLogoProps) {
  return (
    <svg
      aria-label="Animated writing logo"
      className={className}
      height={(width * 2) / 3}
      style={{ display: "block" }}
      viewBox="0 0 300 200"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flip Y axis: original SVG uses bottom-left origin at 1/10th scale */}
      <g transform="translate(0,200) scale(0.1,-0.1)">
        {PATHS.map((d, i) => (
          <AnimatedPath d={d} fill={stroke} index={i} key={d} />
        ))}
      </g>
    </svg>
  );
}
