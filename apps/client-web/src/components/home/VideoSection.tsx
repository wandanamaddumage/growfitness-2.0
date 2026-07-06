import React from 'react';
import { Play } from "lucide-react";

export const VideoSection: React.FC = () => (
  <section className="relative overflow-hidden px-6 md:px-12 py-24" style={{ background: "var(--gf-cream)" }}>
    <img src="images/Grow VI Elements/Icons/Mix abs 2.png" alt='Personal' className="absolute w-[200px] opacity-30 pointer-events-none" style={{ left: -20, bottom: -20 }} />

    <div className="max-w-[1240px] mx-auto relative z-10">
      <div className="text-center mb-13">
        <p className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gf-green)" }}>See it in action</p>
        <h2 className="uppercase" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,64px)", lineHeight: 0.92, color: "var(--gf-green-deep)" }}>
          How sessions happen
        </h2>
      </div>

      <div
        className="relative mx-auto w-full max-w-[900px] aspect-video rounded-[32px] flex flex-col items-center justify-center gap-5 overflow-hidden"
        style={{ background: "var(--gf-green-deep)", border: "2px solid var(--gf-green-deep)", boxShadow: "var(--shadow-pop)" }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(35,182,133,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <button
          className="w-[88px] h-[88px] rounded-full flex items-center justify-center relative z-10"
          style={{ background: "var(--gf-green)", boxShadow: "0 6px 0 rgba(0,0,0,0.3)" }}
        >
          <Play size={32} fill="white" stroke="none" />
        </button>
        <div className="text-center relative z-10">
          <p style={{ fontFamily: "var(--font-alt)", fontWeight: 700, fontSize: 20, color: "white" }}>Your session video here</p>
          <p className="text-sm mt-1.5" style={{ color: "var(--gf-leaf)" }}>YouTube, Vimeo, or direct upload — your choice</p>
        </div>
        <div className="absolute bottom-5 right-6 rounded-lg px-3 py-1 z-10" style={{ background: "rgba(0,0,0,0.5)" }}>
          <p className="text-[13px] font-semibold text-white tabular-nums">2:34</p>
        </div>
      </div>

      <p className="text-center text-[15px] mt-5" style={{ color: "var(--fg-2)" }}>Real kids. Real sessions. Real energy.</p>
    </div>
  </section>
);