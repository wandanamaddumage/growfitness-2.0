import React from 'react';

interface SquiggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const Squiggle: React.FC<SquiggleProps> = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 300 80" className={className} style={style}>
    <path
      d="M0 40 C 30 0, 60 80, 90 40 S 150 0, 180 40 S 240 80, 270 40 S 300 0, 300 40"
      fill="none"
      stroke="var(--gf-green-deep)"
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>
);