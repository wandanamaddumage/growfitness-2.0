export function Eyebrow({ children, color = "var(--fg-4)" }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      fontFamily: "var(--font-sans)"
    }}>
      {children}
    </p>
  );
}

export function NumberBadge({
  number,
  color,
}: {
  number: number;
  color: string;
}) {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: color,
        color:
          color === "var(--gf-sun)" || number === 4
            ? "var(--gf-green-deep)" // or "#000"
            : "#fff",
        fontFamily: "var(--font-sans)",
        fontWeight: 800,
        fontSize: 24,
        border: "3px solid var(--gf-green-deep)",
        boxShadow: "0 4px 0 #000",
      }}
    >
      {number}
    </div>
  );
}

export function Squiggle({ style = {}, color = "var(--gf-leaf)" }) {
  return (
    <svg
      width="180"
      height="120"
      viewBox="0 0 180 120"
      fill="none"
      style={{ opacity: 0.18, position: "absolute", ...style }}
    >
      <path
        d="M4 60 C 30 10, 60 110, 90 60 S 150 10, 176 60"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}