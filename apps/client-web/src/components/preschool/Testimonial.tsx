import { Circle, User } from "lucide-react";

export default function Testimonial() {
  return (
    <section style={{ background: "var(--gf-green)" }}>
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <Circle size={54} className="mx-auto mb-6 text-white" fill="#fff" />
        <p className="gf-h-display text-white text-4xl md:text-4xl font-bold leading-snug mb-7">
          &ldquo;I was nervous to introduce something new mid-term. Within two
          sessions, kids were asking when Grow was coming back.&rdquo;
        </p>
        <div className="inline-flex items-center gap-3 bg-black/10 rounded-full p-3 px-6">
          <span className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white text-md font-bold border border-white/50">
            <User size={16} />
          </span>
          <span className="text-left">
            <p className="text-white text-md font-bold leading-none">
              Director, Montessori Preschool, Colombo
            </p>
            <p className="text-white/70 text-md leading-none mt-1">
              Partner since 2024
            </p>
          </span>
        </div>
      </div>
    </section>
  );
}