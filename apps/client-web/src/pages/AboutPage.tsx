import { Image as ImageIcon, ArrowRight } from "lucide-react";
import { Squiggle } from "@/components/about/SharedComponents";
import WhyWeStarted from "@/components/about/WhyWeStarted";
import WhoWeAre from "@/components/about/WhoWeAre";

function BurstFlower({ style = {} }) {
  return (
    <svg className="animate-spin-slow" width="70" height="70" viewBox="0 0 70 70" fill="none" style={{ position: "absolute", opacity: 0.7, ...style }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} x1="35" y1="35" x2="35" y2="6" stroke="var(--gf-green-deep)" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 36} 35 35)`} />
      ))}
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="gf-scope pt-20" style={{ minHeight: "100vh", background: "var(--gf-cream)" }}>
      {/* HERO DROPZONE */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "8px 24px 64px" }}>
        <div className="border border-gray-200 rounded-3xl h-[380px] bg-[var(--gf-green-100)] border-[var(--line)] shadow-[0_10px_0_var(--gf-green-deep)] flex flex-col items-center justify-center gap-3"
        style={{ 
          border: "3px solid var(--gf-green-deep)",
          boxShadow: "0 10px 0 var(--gf-ink",
        }}
        >
          <ImageIcon size={26} style={{ color: "var(--fg-3)" }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-3)" }}>Drop your team photo here</span>
        </div>
      </section>

      {/* TITLE */}
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px 56px", textAlign: "center" }}>
        <h1
          className="text-6xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Why we<br /><span style={{ color: "var(--gf-green)" }}>started</span>
        </h1>
        <p className="text-xl" style={{ marginTop: 24, lineHeight: 1.6, color: "var(--fg-2)", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
          The story behind Grow Fitness, and the two people who built it.
        </p>
      </section>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderTop: "1px solid var(--line)" }} />
      </div>

      {/* WHY WE STARTED SECTION */}
      <WhyWeStarted />

      {/* WHO WE ARE SECTION */}
      <WhoWeAre />

      {/* TESTIMONIAL */}
      <section style={{ position: "relative", overflow: "hidden", background: "var(--gf-sun)" }}>
        <BurstFlower style={{ top: 40, left: 40 }} />
        <BurstFlower style={{ bottom: 40, right: 56 }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px", position: "relative", textAlign: "start" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gf-green-deep)", marginBottom: 24 }}>In their words</p>
          <p style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, lineHeight: 1.35, color: "var(--gf-green-deep)", marginBottom: 24 }}>
            &ldquo;Aadith has been part of the program for a while now, and it&apos;s really helped him stay away from the TV and phone. His fitness level, and even his focus in his studies, have both improved. I&apos;d highly recommend the sessions and the coaches.&rdquo;
          </p>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg-2)" }}>Parent of Aadith</p>
        </div>
      </section>

      {/* CTA */}
      <section className="gf-scope" style={{ position: "relative", overflow: "hidden", background: "var(--gf-green-deep)" }}>
        <Squiggle style={{ bottom: 16, right: 24 }} />
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "112px 24px", position: "relative", textAlign: "center" }}>
          <h2 className="text-7xl" style={{ fontFamily: "var(--font-display)", lineHeight: 1.05, textTransform: "uppercase", color: "#fff", margin: 0 }}>
            Everything we do<br />comes back to<br /><span style={{ color: "var(--gf-sun)" }}>one thing.</span>
          </h2>
          <p className="text-2xl" style={{ marginTop: 24, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            A happy, confident kid who moves well. That&apos;s not a slogan for us. It&apos;s the actual goal of every session, every coach, every week.
          </p>
          <button className="gf-btn-pop" style={{ marginTop: 36, background: "var(--gf-sun)", color: "var(--gf-green-deep)", boxShadow: "0 6px 0 #c7c400", fontSize: 20, padding: "16px 50px" }}>
            Book your first session <ArrowRight size={20} />
          </button>
        </div>
      </section>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ borderTop: ".5px solid rgba(82, 99, 82, 0.75)" }} />
      </div>
    </div>
  );
}