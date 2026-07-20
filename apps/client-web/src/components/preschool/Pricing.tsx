import { ArrowRight, Check } from "lucide-react";

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
          <span
            className="gf-eyebrow inline-block text-md font-bold mb-8"
            style={{ color: "var(--gf-green)" }}
          >
            THE PROGRAM
          </span>
          <p className="gf-h-display text-6xl md:text-6xl font-bold mb-4">
            Simple. Proven.
          </p>
          <p className="text-xl my-8 max-w-[380px]" style={{ color: "var(--fg-2)" }}>
            Up to 30 kids. One session a week. A full month, run by us, inside
            your preschool.
          </p>
          <ul className="space-y-2.5 text-lg">
            {[
              "We bring all the equipment",
              "No staff training required",
              "Works within your existing timetable",
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
          <ul className="space-y-2.5 text-lg font-semibold pt-2">
            {[
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

      <div className="bg-white rounded-3xl relative"
       style={{ boxShadow: "2px 6px 1px 4px var(--gf-green-deep)" }}
      >
        <div
          className="rounded-t-3xl p-7 relative"
          style={{ background: "var(--gf-green-deep)", boxShadow: "var(--shadow-2)" }}
        > 
        <span
            className="gf-eyebrow inline-block text-md font-bold mb-8"
            style={{ color: "var(--gf-leaf)" }}
          >
            PER CHILD, PER SESSION
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="gf-h-display text-5xl font-bold" style={{ color: "var(--gf-sun)" }}>
              580
            </span>
            <span className="text-white font-bold text-md font-bold">LKR</span>
          </div>
          <p className="text-white/60 text-md mb-6">
            Per child, per session · Billed at 17,400 LKR / month for up to 30
            kids.
          </p>
          </div>
          <div className="space-y-3 mb-7 p-6 pl-8">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-5">
                <Check size={15} color="var(--gf-leaf)" strokeWidth={3} />
                <span className="text-gf-deep-green text-md">{f}</span>
              </div>
            ))}
             <div>
          <a
            href="/free-session"
            className="gf-btn-pop text-[17px] px-9 py-[18px] mt-3"
            style={{ color: "white", background: "var(--gf-green)", boxShadow: "0 8px 0 var(--gf-green-deep)" }}
          >
            Book the free session
            <ArrowRight size={18} strokeWidth={2.5} />
          </a>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}