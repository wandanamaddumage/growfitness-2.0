import { Check, ChevronRight } from "lucide-react";

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
    <section style={{ background: "var(--gf-green-deep)" }}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 pb-20 pt-5">
       <div className="text-center mb-10 sm:mb-14 md:mb-20">
        <span
          className="gf-eyebrow inline-block text-xs sm:text-sm md:text-base font-bold mb-4 sm:mb-6 md:mb-8"
          style={{ color: "var(--gf-leaf)" }}
        >
          WHAT WE ACTUALLY DO
        </span>

        <h1 className="gf-h-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-full sm:max-w-2xl lg:max-w-[800px] mx-auto leading-tight px-4 sm:px-6 text-white">
          Structured movement programs for preschools.
        </h1>
      </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            className="rounded-2xl p-8 text-white pb-32"
            style={{ background: "var(--fg-5)", 
              border: "1px solid var(--fg-2)"
            }}
          >
            <span
              className="gf-eyebrow inline-block px-5 py-1 pt-2 rounded-full mb-5 mt-8 font-bold text-sm"
              style={{ background: "var(--gf-sun)", color: "var(--gf-green-deep)" }}
            >
              THE FRAMEWORK
            </span>
            <p className="gf-h-display text-4xl my-3 font-bold">Built on LTAD</p>
            <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              &ldquo;Long Term Athlete Development&rdquo; — the framework used
              globally, adapted for how kids actually learn: through play.
              Age-appropriate, science-backed, and designed for preschoolers
              specifically.
            </p>
          </div>

          <div
            className="rounded-2xl p-8 py-16"
            style={{ background: "#fff", boxShadow: "var(--shadow-1)" }}
          >
            <span
              className="gf-eyebrow inline-block mb-5 font-bold text-sm"
              style={{ color: "var(--gf-green)" }}
            >
              THE DISTINCTION
            </span>

            <div
              className="rounded-xl p-5 mb-3 flex items-center gap-5"
              style={{ background: "var(--gf-sun-50)" }}
            >
              <span
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-md font-bold"
                style={{ background: "var(--gf-green-50)", color: "var(--gf-green)" }}
              >
                <ChevronRight size={16} />
              </span>
              <div>
                <p className="font-bold text-lg">Standard play</p>
                <p className="text-md" style={{ color: "var(--fg-2)" }}>
                  Free movement. It entertains. Important, but not enough.
                </p>
              </div>
            </div>

            <div
              className="rounded-xl p-5 flex items-center gap-5"
              style={{ background: "var(--gf-green)" }}
            >
              <span className="w-10 h-10 rounded-lg bg-white/25 flex items-center justify-center flex-shrink-0">
                <Check size={14} color="#fff" strokeWidth={3} />
              </span>
              <div>
                <p className="font-bold text-lg text-white">
                  Grow sessions
                </p>
                <p className="text-md text-white/85">
                  Structured skill-building. It develops.
                </p>
              </div>
            </div>

            <p className="text-lg font-bold mt-6" style={{ color: "var(--fg-2)" }}>
              We build the second — kids experience the first.
            </p>
          </div>
        </div>

        <div className="pt-20">
          <div style={{ borderTop: "1px solid rgba(82, 99, 82, 0.75)" }} />
        </div>

        {/* Outcomes */}
        <div className="grid md:grid-cols-[280px_1fr] gap-16 items-start mt-32">
          <div>
            <span
              className="gf-eyebrow inline-block mb-5 font-bold text-sm"
              style={{ color: "var(--gf-leaf)" }}
            >
              THE OUTCOMES
            </span>
            <p className="gf-h-display text-4xl leading-tight font-semibold" style={{ color: "var(--gf-cream)" }}>
              What your kids actually walk away with.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {outcomes.map((o) => (
              <div
                key={o.title}
                className="gf-card-lift rounded-2xl p-5"
                style={{
                  boxShadow: "var(--shadow-1)",
                  backgroundColor: "var(--fg-5)",
                  border: "1px solid var(--fg-2)",
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="w-10 h-10 rounded-md flex-shrink-0 mt-1"
                    style={{ background: o.accent ?? "var(--gf-green)" }}
                  />

                  <div>
                    <p className="font-bold text-lg mb-1 leading-snug text-white">
                      {o.title}
                    </p>
                    <p className="text-md text-white/85">
                      {o.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}