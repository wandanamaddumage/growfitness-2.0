import React from 'react';
import { Smartphone, TreePine, TrendingDown } from "lucide-react";

export const ChallengesSection: React.FC = () => (
  <section className="relative overflow-hidden px-6 md:px-12 py-24" style={{ background: "var(--gf-leaf-50)" }}>
    <div className="max-w-[1240px] mx-auto grid md:grid-cols-[1fr_380px] gap-16 items-center relative z-10">
      <div>
        <p className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gf-green)" }}>
          The problem we're solving
        </p>
        <h2 style={{ fontFamily: "var(--font-alt)", fontWeight: 900, fontSize: 48, lineHeight: 1.1, color: "var(--gf-green-deep)", marginBottom: 14 }}>
          Today's kids face
          <br />
          three big challenges.
        </h2>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: 460, marginBottom: 40 }}>
          These affect confidence, attention, and long-term health. We battle all three through structured physical activity every single week.
        </p>

        <div className="flex flex-col gap-3.5">
          {[
            { icon: <Smartphone size={20} color="white" strokeWidth={2} />, t: "Increased screen addiction", d: "Average kid is on screens 6+ hours daily" },
            { icon: <TreePine size={20} color="white" strokeWidth={2} />, t: "Reduced outdoor play", d: "Kids are moving less than any generation before them" },
            { icon: <TrendingDown size={20} color="white" strokeWidth={2} />, t: "Declining physical literacy", d: "Basic movement skills underdeveloped by age 10" },
          ].map((c) => (
            <div
              key={c.t}
              className="gf-challenge-item flex items-center gap-4 rounded-2xl p-6 z-50"
              style={{ background: "white", border: "1.5px solid var(--line)", boxShadow: "var(--shadow-1)" }}
            >
              <div className="w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: "var(--gf-green)", boxShadow: "0 3px 0 var(--gf-green-deep)" }}>
                {c.icon}
              </div>
              <div>
                <p className="font-bold text-[16px]" style={{ color: "var(--gf-green-deep)" }}>{c.t}</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--fg-2)" }}>{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center relative">
        <div
          className="w-[300px] h-[300px] rounded-full absolute"
          style={{ background: "var(--gf-green-100)" }}
        />

        <img
          src="/images/Grow VI Elements/Icons/Grow buddy.png"
          alt="mix abs"
          className="absolute w-[320px] pointer-events-none z-10 animate-bounce"
          style={{ left: 20, bottom: -180 }}
        />
      </div>
    </div>
  </section>
);