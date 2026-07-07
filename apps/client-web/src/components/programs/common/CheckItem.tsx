import { Check } from "lucide-react";

interface CheckItemProps {
  title: string;
  desc: string;
}

export function CheckItem({ title, desc }: CheckItemProps) {
  return (
    <div className="flex gap-3">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--gf-green-50)", color: "var(--gf-green)" }}
      >
        <Check size={14} strokeWidth={3} />
      </span>
      <div>
        <p className="font-bold leading-snug" style={{ color: "var(--gf-ink)" }}>
          {title}
        </p>
        <p className="mt-0.5 text-sm leading-snug" style={{ color: "var(--fg-2)" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}