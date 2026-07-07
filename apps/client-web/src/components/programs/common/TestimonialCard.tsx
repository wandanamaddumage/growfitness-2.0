import { Star, Users } from "lucide-react";
import { Pill } from "./Pill";

interface TestimonialCardProps {
  tag: string;
  quote: string;
  name: string;
  parentOf: string;
  highlighted?: boolean;
}

function Stars() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={18}
          fill="var(--gf-sun)"
          strokeWidth={0}
        />
      ))}
    </div>
  );
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
          className="inline-flex items-center w-fit gap-1.5 rounded-full px-3 py-1 mb-4"
          style={{
            background: "var(--gf-sun)",
            border: "1.5px solid var(--gf-green-deep)",
          }}
        >
          <span
            className="font-bold text-[11px] uppercase tracking-widest"
            style={{ color: "var(--gf-green-deep)" }}
          >
            Top Review
          </span>
        </div>
      )}

      {/* Optional Tag */}
      {!highlighted && (
        <Pill variant="sun" className="w-fit uppercase mb-4">
          {tag}
        </Pill>
      )}

      {/* Stars */}
      <Stars />

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