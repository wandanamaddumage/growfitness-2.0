import { Check } from "lucide-react";

export default function Pricing() {
  const features = [
    "Up to 30 kids per session",
    "One structured session per week",
    "Trained Grow coach on-site",
    "All equipment provided",
  ];
  
  return (
    <section style={{ background: "var(--gf-cream)" }}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          {/* <Eyebrow color="var(--fg-3)">The program</Eyebrow> */}
          <h2 className="gf-h-display text-[30px] md:text-[36px] mb-4">
            Simple. Proven.
          </h2>
          <p className="text-[14.5px] mb-6 max-w-[380px]" style={{ color: "var(--fg-2)" }}>
            Up to 30 kids. One session a week. A full month, run by us, inside
            your preschool.
          </p>
          <ul className="space-y-2.5 text-[14px] font-semibold">
            {[
              "We bring all the equipment",
              "No staff training required",
              "Works within your existing timetable",
              "First session is free. No commitment",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "var(--gf-green)" }}
                />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-3xl p-7 relative"
          style={{ background: "var(--gf-green-deep)", boxShadow: "var(--shadow-2)" }}
        >
          {/* <Squiggle className="absolute -right-4 -top-6 opacity-50" /> */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="gf-h-display text-[38px]" style={{ color: "var(--gf-sun)" }}>
              580
            </span>
            <span className="text-white font-bold text-[15px]">LKR</span>
          </div>
          <p className="text-white/60 text-[12.5px] mb-6">
            Per child, per session · Billed at 17,400 LKR / month for up to 30
            kids.
          </p>

          <div className="space-y-3 mb-7">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <Check size={15} color="var(--gf-leaf)" strokeWidth={3} />
                <span className="text-white text-[13.5px]">{f}</span>
              </div>
            ))}
          </div>

          {/* <PillButton variant="primary" className="w-full justify-center">
            Book the free session
            <ChevronRight size={16} strokeWidth={3} />
          </PillButton> */}
        </div>
      </div>
    </section>
  );
}