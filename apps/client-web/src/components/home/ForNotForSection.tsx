import React from 'react';
import { X, Check } from "lucide-react";

export const ForNotForSection: React.FC = () => (
  <section className="relative px-6 md:px-12 py-24" style={{ background: "var(--gf-green-deep)" }}>
    <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-6">
      {/* NOT FOR */}
      <div className="rounded-[32px] p-11" style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)" }}>
        <h3 style={{ fontFamily: "var(--font-alt)", fontWeight: 900, fontSize: 30, color: "white", marginBottom: 8 }}>
          This is <span style={{ opacity: 0.5 }}>NOT</span> for parents
        </h3>
        <p className="text-sm mb-7" style={{ color: "var(--fg-3)" }}>who...</p>

        <div className="flex flex-col gap-3.5">
          {[
            "Are waiting for kids to give up screens by themselves",
            'Think physical development will "just happen" on its own',
            "Prefer kids to stay comfortable rather than challenged",
            "Are looking only for competition or medals",
          ].map((line) => (
            <div key={line} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "rgba(232,99,77,0.2)" }}>
                <X size={11} color="#e8634d" strokeWidth={3} />
              </div>
              <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{line}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOR YOU */}
      <div className="relative rounded-[32px] p-11 overflow-hidden" style={{ background: "white", border: "2px solid var(--gf-green-deep)", boxShadow: "var(--shadow-pop)" }}>
        <div
          className="absolute px-4 py-1.5"
          style={{ top: -2, right: 32, background: "var(--gf-sun)", borderRadius: "0 0 16px 16px", border: "2px solid var(--gf-green-deep)", borderTop: "none" }}
        >
          <p className="font-bold text-[11px] uppercase tracking-widest" style={{ color: "var(--gf-green-deep)" }}>For you</p>
        </div>

        <h3 style={{ fontFamily: "var(--font-alt)", fontWeight: 900, fontSize: 30, color: "var(--gf-green-deep)", marginBottom: 8 }}>
          This IS for parents
        </h3>
        <p className="text-sm mb-7" style={{ color: "var(--fg-2)" }}>who notice their child…</p>

        <div className="flex flex-col gap-3.5 mb-9">
          {[
            'Asks for "just five more minutes" of screen time, every time',
            "Dislike physical play or sports",
            "Gets frustrated fast and quits before they improve",
            "Needs structured physical development",
          ].map((line) => (
            <div key={line} className="flex items-start gap-3">
              <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-px" style={{ background: "var(--gf-green)" }}>
                <Check size={12} color="white" strokeWidth={3} />
              </div>
              <p className="text-[15px]" style={{ color: "var(--fg-1)", lineHeight: 1.5 }}>{line}</p>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="gf-btn-pop w-full justify-center text-[16px] px-6 py-4"
          style={{ color: "white", background: "var(--gf-green)", boxShadow: "0 6px 0 var(--gf-green-deep)" }}
        >
          Try the first session
        </a>
      </div>
    </div>
  </section>
);