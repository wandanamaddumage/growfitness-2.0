import { Check } from "lucide-react";

interface CheckItemProps {
  title: string;
  desc: string;
  bgColor?: string;
  checkColor?: string;
}

export function CheckItem({
  title,
  desc,
  bgColor = "var(--gf-green)",
  checkColor = "var(--gf-cream)",
}: CheckItemProps) {
  return (
    <div className="flex gap-3">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
        style={{
          backgroundColor: bgColor,
          borderColor: "var(--gf-ink)",
          color: checkColor,
        }}
      >
        <Check size={14} strokeWidth={3} />
      </span>

      <div>
        <p className="font-bold leading-snug" style={{ color: "var(--gf-ink)" }}>
          {title}
        </p>
        <p className="mt-0.5 text-md leading-snug" style={{ color: "var(--fg-2)" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}