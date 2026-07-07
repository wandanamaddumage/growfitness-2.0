import { Check, Plus, Heart, Calendar, ArrowRight, Info } from "lucide-react";
import { Pill } from "./common/Pill";
import { CheckItem } from "./common/CheckItem";

export function ProgramCards() {
  return (
    <section className="px-6 py-20" style={{ backgroundColor: "var(--gf-cream)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Pill variant="sun">
          <Check size={12} strokeWidth={3} /> MOST KIDS START HERE
        </Pill>
        <p className="hidden text-sm italic" style={{ color: "var(--fg-2)" }}>
          For kids who need dedicated attention first
        </p>
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-6 md:grid-cols-2">
        {/* Group Sessions Card */}
        <div 
          className="overflow-hidden rounded-3xl bg-white"
          style={{ 
            border: `1px solid var(--gf-ink)`,
            boxShadow: "0 6px 0 rgba(19,32,24,0.9)"
          }}
        >
          <div className="relative px-7 pb-8 pt-7" style={{ backgroundColor: "var(--gf-green)" }}>
            <span className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-white" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Group Sessions</p>
            <h3
              className="mt-2 text-2xl font-extrabold uppercase leading-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              For kids who want a fun way to start fitness.
            </h3>
            <div className="mt-4 flex gap-2">
              <Pill variant="white" className="bg-white/20 text-white">Ages 4 to 12</Pill>
              <Pill variant="white" className="bg-white/20 text-white">1 hr per session</Pill>
            </div>
          </div>

          <div className="space-y-5 px-7 py-7">
            <CheckItem title="6 kids per coach" desc="Small enough that every kid is seen. Big enough to bring the energy." />
            <CheckItem title="Saturdays, 4 locations" desc="Find a spot near you. Same great session everywhere." />
            <CheckItem title="Agility, strength, balance" desc="Built through play. No drills, no lectures. Just moving." />

            <div className="flex items-start gap-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--gf-sun)" }}>
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/40">
                <Info size={14} style={{ color: "var(--gf-ink)" }} />
              </span>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--gf-ink)" }}>Only 30 spots per batch</p>
                <p className="text-xs" style={{ color: "var(--gf-ink)", opacity: 0.75 }}>
                  Batches fill up fast. Check if there&apos;s still a spot for your kid.
                </p>
              </div>
            </div>

            <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "var(--gf-green-50)" }}>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--gf-ink)" }}>
                “They&apos;ll start to love physical activities and gain confidence doing them.”
              </p>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "var(--gf-ink)" }}
            >
              Try out a free session <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Personal Training Card */}
        <div 
          className="overflow-hidden rounded-3xl bg-white"
          style={{ 
            border: `1px solid var(--gf-ink)`,
            boxShadow: "0 6px 0 rgba(19,32,24,0.9)"
          }}
        >
          <div style={{ height: 5, backgroundColor: "var(--gf-sun)" }} />
          <div className="relative px-7 pb-8 pt-6" style={{ backgroundColor: "var(--gf-ink)" }}>
            <span
              className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--gf-sun)", color: "var(--gf-ink)" }}
            >
              <Heart size={16} />
            </span>
            <Pill variant="sun" className="mb-3">
              <Plus size={12} strokeWidth={3} /> 1-ON-1
            </Pill>
            <h3
              className="text-2xl font-extrabold uppercase leading-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              For kids who need individual attention
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill variant="white" className="bg-white/10 text-white">Weekday sessions</Pill>
              <Pill variant="white" className="bg-white/10 text-white">1 hr / session</Pill>
            </div>
            <div className="mt-3">
              <Pill variant="sun">Under 4 or over 12? Start here.</Pill>
            </div>
          </div>

          <div className="space-y-5 px-7 py-7">
            <CheckItem title="We start with an assessment" desc="Before the first session, we get to know your kid. Their strengths, gaps, and what they actually enjoy." />
            <CheckItem title="A plan built just for them" desc="No templates. Every session follows a customised workout plan designed around your child's specific goals." />
            <CheckItem title="Bi-monthly progress reports" desc="Parents receive a detailed update every two months. You'll always know exactly how your kid is growing." />

            <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--gf-sun)" }}>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--gf-ink)" }}>
                “They will be perform better at any sport or any form of physical activity within 12 or less weeks.”
              </p>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white"
              style={{ backgroundColor: "var(--gf-ink)" }}
            >
              Book a free assessment <Calendar size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Not sure box */}
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white px-6 py-5" style={{ border: "1px solid rgba(19,32,24,0.08)" }}>
        <div className="flex gap-3">
          <span 
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--gf-green-50)", color: "var(--gf-green)" }}
          >
            <Info size={15} />
          </span>
          <div>
            <p className="font-bold" style={{ color: "var(--gf-ink)" }}>Not sure which one to choose?</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--fg-2)" }}>
              Group Sessions are for kids aged 4 to 12. If your child is outside that range, or needs more focused attention, Personal Training is the right fit regardless of age. Not sure? Message us and we will point you in the right direction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}