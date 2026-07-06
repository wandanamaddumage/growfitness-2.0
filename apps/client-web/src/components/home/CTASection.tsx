import React from 'react';
import { ArrowRight } from "lucide-react";

export const CTASection: React.FC = () => (
  <section
    className="relative overflow-hidden px-6 md:px-12 py-24"
    style={{ background: "var(--gf-sun)", borderTop: "2px solid var(--gf-green-deep)", borderBottom: "2px solid var(--gf-green-deep)" }}
  >
     <img src="images/Grow VI Elements/Icons/Mix abs.png" alt='Personal' className="absolute w-[200px] opacity-30 pointer-events-none" style={{ left: -20, top: -40 }} />

    <div className="max-w-[1240px] mx-auto grid md:grid-cols-[1fr_auto] gap-16 items-center relative z-10">
      <div>
        <p className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "var(--gf-green-deep)", opacity: 0.6 }}>
          Ready to start?
        </p>
        <h2 className="uppercase mb-6" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px,6vw,76px)", lineHeight: 0.92, color: "var(--gf-green-deep)" }}>
          PHONE DOWN.
          <br />
          BODY UP.
          <br />
          LET'S GO.
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--gf-green-deep)", opacity: 0.75, maxWidth: 460, marginBottom: 36 }}>
          Join the families across Sri Lanka who chose Grow for their child's health and confidence.
        </p>

        <a
          href="#"
          className="gf-btn-pop text-[18px] px-10 py-[18px]"
          style={{ color: "white", background: "var(--gf-green-deep)", boxShadow: "0 8px 0 rgba(36,62,54,0.35)" }}
        >
          Enroll your child
          <ArrowRight size={18} strokeWidth={2.5} />
        </a>
      </div>

      <div className="flex-shrink-0 w-[280px] hidden md:block">
        {/* <Buddy fast className="w-full" /> */}
        <img src="images/Grow VI Elements/Icons/Grow buddy 2.png" alt='Personal' className="absolute w-[320px] pointer-events-none z-50 animate-bounce" style={{ right: -20, bottom: -20 }} />
      </div>
    </div>

    <img src="images/Grow VI Elements/Icons/Mix abs.png" alt='Personal' className="absolute w-[200px] opacity-30 pointer-events-none" style={{ right: -10, bottom: -20 }} />
  </section>
);