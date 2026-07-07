export function Mascot() {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: "var(--gf-sun)", opacity: 0.12 }}
      />
      <svg width="220" height="230" viewBox="0 0 220 230" className="relative gf-buddy-float">
        <line x1="95" y1="150" x2="88" y2="222" stroke="var(--gf-sun)" strokeWidth="5" strokeLinecap="round" />
        <line x1="125" y1="150" x2="132" y2="222" stroke="var(--gf-sun)" strokeWidth="5" strokeLinecap="round" />
        <path d="M75 110 C55 95 45 70 40 50" stroke="var(--gf-sun)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M145 110 C165 95 175 70 180 50" stroke="var(--gf-sun)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <polygon points="110,20 175,150 45,150" fill="var(--gf-green)" />
        <circle cx="95" cy="115" r="5" fill="var(--gf-ink)" />
        <circle cx="125" cy="115" r="5" fill="var(--gf-ink)" />
        <path d="M95 132 Q110 142 125 132" stroke="var(--gf-ink)" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}