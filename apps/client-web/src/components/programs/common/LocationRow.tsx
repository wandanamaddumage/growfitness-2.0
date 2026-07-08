import { MapPin, ArrowUpRight } from "lucide-react";

interface LocationRowProps {
  name: string;
  sub: string;
  sessionType: "personal" | "group";
}

export function LocationRow({
  name,
  sub,
  sessionType,
}: LocationRowProps) {
  const iconBg =
    sessionType === "personal"
      ? "var(--gf-leaf)" 
      : "var(--gf-sun)"; 

  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/5"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", position: 'relative', zIndex: 1 }}
    >
      <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: iconBg,
            color: "var(--gf-ink)",
          }}
        >
          <MapPin size={18} />
        </span>

        <div>
          <p className="text-lg font-extrabold text-white">{name}</p>
          <p
            className="text-md"
            style={{
              color: "var(--gf-leaf)",
            }}
          >
            {sub}
          </p>
        </div>
      </div>

      <ArrowUpRight size={16} className="text-white/40" />
    </div>
  );
}