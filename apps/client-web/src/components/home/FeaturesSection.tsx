import React from 'react';

const features = [
  {
    icon: "/images/Grow VI Elements/Icons/Heart.png",
    t: "Fun & Engaging",
    d: "Interactive workouts and games designed specifically for children so fitness feels like play, not work.",
  },
  {
    icon: "/images/Grow VI Elements/Icons/T shirt.png",
    t: "Parent Dashboard",
    d: (
      <>
        Track your child's progress, schedule sessions, and connect with coaches all in one place.
        <br />
        <i>(For personal training sessions only)</i>
      </>
    ),
  },
  {
    icon: "/images/Grow VI Elements/Icons/Cup.png",
    t: "Expert Coaches",
    d: "Certified fitness professionals who specialise in child development and age-appropriate training methods.",
  },
];

export const FeaturesSection: React.FC = () => (
  <section className="px-6 md:px-12 py-24" style={{ background: "white" }}>
    <div className="max-w-[1240px] mx-auto">
      <div className="text-center mb-16">
        <p className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gf-green)" }}>
          What makes us different
        </p>
        <h2 style={{ fontFamily: "var(--font-alt)", fontWeight: 900, fontSize: 48, color: "var(--gf-green-deep)" }}>
          Built for kids. Trusted by parents.
        </h2>
        <p className="mx-auto mt-4" style={{ fontSize: 18, color: "var(--fg-2)", maxWidth: 520, lineHeight: 1.6 }}>
          We provide a complete platform for kids' fitness with specialist tools for parents and coaches.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.t} className="gf-card-lift rounded-[32px] p-10" style={{ background: "var(--gf-cream)", border: "1.5px solid var(--line)" }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
              <img src={f.icon} alt={f.t} className="w-full h-full object-contain" />
            </div>
            <h3 style={{ fontFamily: "var(--font-alt)", fontWeight: 900, fontSize: 24, color: "var(--gf-green-deep)", marginBottom: 12 }}>
              {f.t}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--fg-2)" }}>{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);