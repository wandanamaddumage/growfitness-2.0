import { MapPin, ChevronRight } from "lucide-react";

interface LocationRowProps {
  name: string;
  sub: string;
}

export function LocationRow({ name, sub }: LocationRowProps) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/5"
      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "var(--gf-sun)" }}
        >
          <MapPin size={15} />
        </span>
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-xs text-white/50">{sub}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-white/40" />
    </div>
  );
}