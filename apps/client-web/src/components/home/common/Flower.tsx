import React from 'react';

interface FlowerProps {
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
}

export const Flower: React.FC<FlowerProps> = ({ className = "", style = {}, animate = false }) => (
  <svg
    viewBox="0 0 200 200"
    className={`${className} ${animate ? "gf-flower-spin" : ""}`}
    style={style}
  >
    {[0, 60, 120, 180, 240, 300].map((deg) => (
      <ellipse
        key={deg}
        cx="100"
        cy="60"
        rx="26"
        ry="42"
        fill="var(--gf-sun)"
        opacity="0.9"
        transform={`rotate(${deg} 100 100)`}
      />
    ))}
    <circle cx="100" cy="100" r="20" fill="var(--gf-green-deep)" opacity="0.9" />
  </svg>
);