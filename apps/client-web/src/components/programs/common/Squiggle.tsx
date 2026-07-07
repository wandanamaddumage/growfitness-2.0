interface SquiggleProps {
  className?: string;
  opacity?: number;
}

export function Squiggle({ className = "", opacity = 0.15 }: SquiggleProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ opacity }}
      fill="none"
    >
      <path
        d="M20 100c15-40 45-40 60 0s45 40 60 0 45-40 40 10"
        className="stroke-gf-sun"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}