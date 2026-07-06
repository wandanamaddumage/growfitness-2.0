import React from 'react';
import { ArrowRight } from "lucide-react";

const stats = [
  {
    n: "7+",
    l: "Preschools & branches",
    icon: "/images/Grow VI Elements/Icons/Dumbell g.png",
  },
  {
    n: "300+",
    l: "Kids in group sessions",
    icon: "/images/Grow VI Elements/Icons/Heart g.png",
  },
  {
    n: "75+",
    l: "Kids in personal training",
    icon: "/images/Grow VI Elements/Icons/Cup y.png",
  },
];

export const StatsSection: React.FC = () => (
  <section className="relative overflow-hidden px-6 md:px-12 py-24" style={{ background: "var(--gf-green-deep)" }}>
    <img
        src="/images/Grow VI Elements/Icons/Yellow abs.png"
        alt="flower"
        className="absolute w-[360px] opacity-70 pointer-events-none"
        style={{ left: -80, top: -60 }}
      />

    <div className="max-w-[1240px] mx-auto text-center relative z-10">
      <p className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "var(--gf-leaf)" }}>
        Helping kids since 2023
      </p>
      <h2
        className="uppercase mb-5"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px,6vw,68px)", lineHeight: 0.92, color: "white" }}
      >
        WE TRAIN KIDS
        <br />
        EVERY WEEK.
      </h2>
      <p className="mx-auto mb-16" style={{ fontSize: 18, color: "var(--gf-leaf)", maxWidth: 520, lineHeight: 1.6 }}>
        Consistent weekly sessions because healthy habits are built one rep at a time.
      </p>

      <div className="grid sm:grid-cols-3 gap-6 mb-14">
        {stats.map((s) => (
          <div
            key={s.l}
            className="flex flex-col items-center gap-4 rounded-3xl px-6 py-10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <img
              src={s.icon}
              alt={s.l}
              className="w-[90px] h-[90px] object-contain"
            />

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 72,
                color: "var(--gf-sun)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {s.n}
            </p>

            <p
              className="font-semibold text-center text-[17px] text-white"
              style={{ lineHeight: 1.3 }}
            >
              {s.l.split(" & ").join("\n& ")}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-10 flex items-center justify-center gap-2.5 flex-wrap">
        <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.65)" }}>
          We partner directly with preschools across Colombo.
        </p>
        <a href="#" className="inline-flex items-center gap-1.5 font-bold text-[15px]" style={{ color: "var(--gf-leaf)" }}>
          See our preschool partnerships
          <ArrowRight size={14} strokeWidth={2.5} />
        </a>
      </div>

      <a
        href="#"
        className="gf-btn-pop text-[16px] px-9 py-4"
        style={{ color: "var(--gf-green-deep)", background: "var(--gf-sun)", boxShadow: "0 6px 0 rgba(255,253,119,0.3)" }}
      >
        Join GROW today
        <ArrowRight size={16} strokeWidth={2.5} />
      </a>
    </div>

    <img
      src="/images/Grow VI Elements/Icons/Mix abs 2.png"
      alt="mix abs"
      className="absolute w-[240px] opacity-50 pointer-events-none"
      style={{ right: -0, bottom: -20 }}
    />
  </section>
);