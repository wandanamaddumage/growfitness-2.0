import React from 'react';

interface BuddyProps {
  className?: string;
  style?: React.CSSProperties;
  fast?: boolean;
}

export const Buddy: React.FC<BuddyProps> = ({ className = "", style = {}, fast = false }) => (
  <svg
    viewBox="0 0 220 220"
    className={`${className} ${fast ? "gf-buddy-float-fast" : "gf-buddy-float"}`}
    style={style}
  >
    <polygon points="110,30 190,180 30,180" fill="var(--gf-green)" stroke="var(--gf-green-deep)" strokeWidth="4" strokeLinejoin="round" />
    <circle cx="90" cy="140" r="9" fill="var(--gf-green-deep)" />
    <circle cx="130" cy="140" r="9" fill="var(--gf-green-deep)" />
    <path d="M85 165 Q110 180 135 165" stroke="var(--gf-green-deep)" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);