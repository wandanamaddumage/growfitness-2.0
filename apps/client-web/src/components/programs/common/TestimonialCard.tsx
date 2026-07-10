import { Users } from "lucide-react";
import { StarRow } from "@/components/home/common/StarRow";

interface TestimonialCardProps {
  tag: string;
  quote: string;
  name: string;
  parentOf: string;
  highlighted?: boolean;
}

export function TestimonialCard({
  tag,
  quote,
  name,
  parentOf,
  highlighted = false,
}: TestimonialCardProps) {
  return (
    <div
      className="gf-card-lift rounded-[32px] p-9 flex flex-col"
      style={
        highlighted
          ? {
              background: "white",
              border: "3px solid var(--gf-green-deep)",
              boxShadow: "var(--shadow-pop)",
            }
          : {
              background: "white",
              border: "1.5px solid var(--line)",
              boxShadow: "var(--shadow-2)",
            }
      }
    >
      {/* Featured badge */}
      {highlighted && (
        <div
          className="inline-flex items-center w-fit gap-1.5 rounded-full px-3 py-1 mb-6"
          style={{
            background: "var(--gf-sun)",
            border: "1.5px solid var(--gf-green-deep)",
          }}
        >
          <span
            className="font-bold text-[12px] uppercase tracking-widest"
            style={{ color: "var(--gf-green-deep)" }}
          >
            Group Session
          </span>
        </div>
      )}

      {/* Optional Tag */}
    {!highlighted && (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase mb-6"
        style={{
          backgroundColor:
            tag.toLowerCase() === "personal training sessions"
              ? "var(--gf-green-50)"
              : "var(--gf-sun-50)",
          border: "1px solid var(--gf-green-50)",
          color:
            tag.toLowerCase() === "personal training sessions"
              ? "var(--gf-green)"
              : "var(--gf-green-deep)",
        }}
      >
        {tag}
      </span>
    )}

      {/* Stars */}
     <StarRow />

      {/* Quote */}
      <p
        className="italic mb-7 mt-4"
        style={{
          fontSize: 16,
          lineHeight: 1.65,
          color: "var(--fg-1)",
        }}
      >
        “{quote}”
      </p>

      {/* Author */}
      <div
        className="flex items-center gap-3 pt-5 mt-auto"
        style={{
          borderTop: "1px solid var(--line)",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "var(--gf-green-100)",
            border: "2px solid var(--line)",
          }}
        >
          <Users
            size={26}
            color="#23b685"
            strokeWidth={1.5}
          />
        </div>

        <div>
          <p
            className="font-bold text-[15px]"
            style={{
              color: "var(--gf-green-deep)",
            }}
          >
            {name}
          </p>

          <p
            className="text-[13px]"
            style={{
              color: "var(--fg-3)",
            }}
          >
            {parentOf}
          </p>
        </div>
      </div>
    </div>
  );
}