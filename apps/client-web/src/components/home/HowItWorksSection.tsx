import React from 'react';
import { PhoneCall, Lightbulb, PlayCircle } from "lucide-react";

export const HowItWorksSection: React.FC = () => (
  <section className="relative overflow-hidden px-6 md:px-12 py-24" style={{ background: "var(--gf-cream)" }}>
    <img src="images/Grow VI Elements/Icons/Mix abs 2.png" alt='Personal' className="absolute w-[200px] opacity-30 pointer-events-none" style={{ right: -30, top: 60 }} />


    <div className="max-w-[1240px] mx-auto relative z-10">
      <div className="text-center mb-16">
        <p className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gf-green)" }}>The process</p>
        <h2
          className="uppercase"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px,5vw,60px)", lineHeight: 0.95, color: "var(--gf-green-deep)" }}
        >
          HOW GROW
          <br />
          FITNESS WORKS.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-14">
        {[
          { icon: <PhoneCall size={24} color="white" strokeWidth={2} />, step: "Step 1", t: "Discuss about your kid", d: "Five minute call to discuss what they're like, what they struggle with, what they need.", dark: false },
          { icon: <Lightbulb size={24} color="white" strokeWidth={2} />, step: "Step 2", t: "Program selection", d: "We recommend the right program. Group sessions, personal training, or both. You decide what fits.", dark: false },
          { icon: <PlayCircle size={24} color="var(--gf-green-deep)" strokeWidth={2} />, step: "Step 3", t: "First session", d: "Group sessions have fixed weekly slots. Personal training is scheduled around your free time slots.", dark: true },
        ].map((s) => (
          <div
            key={s.t}
            className="gf-step-card rounded-[32px] p-9"
            style={
              s.dark
                ? { background: "var(--gf-green-deep)", border: "2px solid var(--gf-green-deep)", boxShadow: "var(--shadow-pop)" }
                : { background: "white", border: "1.5px solid var(--line)", boxShadow: "var(--shadow-2)" }
            }
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center"
                style={{ background: s.dark ? "var(--gf-sun)" : "var(--gf-green)", boxShadow: s.dark ? "0 4px 0 rgba(0,0,0,0.3)" : "0 4px 0 var(--gf-green-deep)" }}
              >
                {s.icon}
              </div>
              <span
                className="uppercase text-[15px]"
                style={{ fontFamily: "var(--font-display)", color: s.dark ? "var(--gf-sun)" : "var(--gf-green)", letterSpacing: "0.05em" }}
              >
                {s.step}
              </span>
            </div>
            <h3 style={{ fontFamily: "var(--font-alt)", fontWeight: 900, fontSize: 26, color: s.dark ? "white" : "var(--gf-green-deep)", marginBottom: 12 }}>
              {s.t}
            </h3>
            <div className="w-8 h-[3px] rounded mb-4" style={{ background: s.dark ? "var(--gf-sun)" : "var(--gf-green)" }} />
            <p style={{ fontSize: 15, lineHeight: 1.6, color: s.dark ? "var(--gf-leaf)" : "var(--fg-2)" }}>{s.d}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href="/free-session"
          className="gf-btn-pop text-[16px] px-10 py-4"
          style={{ color: "white", background: "var(--gf-green)", boxShadow: "0 7px 0 var(--gf-green-deep)" }}
        >
          Try the first session
        </a>
      </div>
    </div>
  </section>
);