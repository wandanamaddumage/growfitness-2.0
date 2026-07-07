import React from "react";

interface PillProps {
  children: React.ReactNode;
  variant?: "green" | "sun" | "leaf" | "white" | "ink" | "transparent";
  className?: string;
}

const variantStyles = {
  green: { bg: "var(--gf-green)", color: "white" },
  sun: { bg: "var(--gf-sun)", color: "var(--gf-ink)" },
  leaf: { bg: "var(--gf-leaf)", color: "var(--gf-ink)" },
  white: { bg: "white", color: "var(--gf-ink)" },
  ink: { bg: "var(--gf-ink)", color: "white" },
  transparent: { bg: "transparent", color: "var(--gf-sun)" },
};

export function Pill({ children, variant = "green", className = "" }: PillProps) {
  const styles = variantStyles[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide ${className}`}
      style={{ backgroundColor: styles.bg, color: styles.color }}
    >
      {children}
    </span>
  );
}