import type { EarningPoint } from "@/types/dashboard";

interface EarningsChartProps {
  data: EarningPoint[];
}

const WIDTH = 720;
const HEIGHT = 180;
const PADDING = 24;

export function EarningsChart({ data }: EarningsChartProps) {
  const amounts = data.map((point) => point.amount);
  const max = Math.max(...amounts);
  const min = Math.min(...amounts);
  const range = max - min || 1;

  const points = data.map((point, index) => {
    const x = PADDING + (index / (data.length - 1)) * (WIDTH - PADDING * 2);
    const y =
      HEIGHT - PADDING - ((point.amount - min) / range) * (HEIGHT - PADDING * 2);
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const last = points[points.length - 1];
  const first = points[0];
  const area = `${line} L ${last[0].toFixed(1)} ${HEIGHT - PADDING} L ${first[0].toFixed(1)} ${HEIGHT - PADDING} Z`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="block h-auto w-full"
      role="img"
      aria-label="Monthly earnings trend"
    >
      <defs>
        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9c323" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f9c323" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#earningsGradient)" />
      <path
        d={line}
        fill="none"
        stroke="#f9c323"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {points.map(([x, y], index) => {
        const isLast = index === points.length - 1;
        return (
          <g key={data[index].month}>
            <circle
              cx={x}
              cy={y}
              r={isLast ? 5 : 3}
              fill={isLast ? "#f9c323" : "#fff"}
              stroke="#f9c323"
              strokeWidth="2"
            />
            <text
              x={x}
              y={HEIGHT - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
              fontFamily="Inter"
            >
              {data[index].month}
            </text>
            {isLast ? (
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#1c1b1b"
                fontFamily="Plus Jakarta Sans"
              >
                Rs.{data[index].amount}k
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
