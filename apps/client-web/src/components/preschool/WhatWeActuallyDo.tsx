import { Check } from "lucide-react";

export default function WhatWeActuallyDo() {
  const outcomes = [
    {
      title: "Age-appropriate workouts",
      body: "Designed for preschool physiology and attention spans.",
    },
    {
      title: "Focus, agility, balance & speed",
      body: "Games built to develop these, not just burn energy.",
    },
    {
      title: 'From "can\'t-sit-still" to "can-follow-instructions"',
      body: "Regulation skills that carry into the classroom.",
    },
    {
      title: "Runs inside your existing schedule",
      body: "We bring everything. No disruption, no staff training.",
      accent: "var(--gf-sun)",
    },
  ];

  return (
    <section style={{ background: "var(--gf-cream)" }}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20">
        <div className="text-center mb-12">
          {/* <Eyebrow color="var(--gf-green)" className="justify-center flex">
            What we actually do
          </Eyebrow> */}
          <h2 className="gf-h-display text-[28px] md:text-[38px] max-w-[560px] mx-auto leading-tight">
            Structured movement programs for preschools.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            className="rounded-2xl p-8 text-white"
            style={{ background: "var(--gf-green-deep)" }}
          >
            <span
              className="gf-eyebrow inline-block px-3 py-1 rounded-full mb-5"
              style={{ background: "var(--gf-sun)", color: "var(--gf-green-deep)" }}
            >
              The framework
            </span>
            <h3 className="gf-h-display text-[22px] mb-3">Built on LTAD</h3>
            <p className="text-[14.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              &ldquo;Long Term Athlete Development&rdquo; — the framework used
              globally, adapted for how kids actually learn: through play.
              Age-appropriate, science-backed, and designed for preschoolers
              specifically.
            </p>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{ background: "#fff", boxShadow: "var(--shadow-1)" }}
          >
            <span
              className="gf-eyebrow inline-block mb-5"
              style={{ color: "var(--fg-3)" }}
            >
              The distinction
            </span>

            <div
              className="rounded-xl p-4 mb-3 flex items-center gap-3"
              style={{ background: "var(--gf-sun-50)" }}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold"
                style={{ background: "rgba(36,62,54,0.08)" }}
              >
                1
              </span>
              <div>
                <p className="font-bold text-[14.5px]">Standard play</p>
                <p className="text-[13px]" style={{ color: "var(--fg-2)" }}>
                  Free movement. It entertains. Important, but not enough.
                </p>
              </div>
            </div>

            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: "var(--gf-green)" }}
            >
              <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                <Check size={14} color="#fff" strokeWidth={3} />
              </span>
              <div>
                <p className="font-bold text-[14.5px] text-white">
                  Grow sessions
                </p>
                <p className="text-[13px] text-white/85">
                  Structured skill-building. It develops.
                </p>
              </div>
            </div>

            <p className="text-[13px] font-semibold mt-4" style={{ color: "var(--fg-2)" }}>
              We build the second — kids experience the first.
            </p>
          </div>
        </div>

        {/* Outcomes */}
        <div className="grid md:grid-cols-[280px_1fr] gap-6 items-start">
          <div>
            {/* <Eyebrow color="var(--fg-3)">The outcomes</Eyebrow> */}
            <h3 className="gf-h-display text-[24px] leading-tight">
              What your kids actually walk away with.
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {outcomes.map((o) => (
              <div
                key={o.title}
                className="gf-card-lift rounded-2xl p-5 bg-white"
                style={{ boxShadow: "var(--shadow-1)" }}
              >
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center mb-3"
                  style={{ background: o.accent ?? "var(--gf-green)" }}
                >
                  <Check size={14} color={o.accent ? "var(--gf-green-deep)" : "#fff"} strokeWidth={3} />
                </span>
                <p className="font-bold text-[14.5px] mb-1 leading-snug">
                  {o.title}
                </p>
                <p className="text-[13px]" style={{ color: "var(--fg-2)" }}>
                  {o.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}