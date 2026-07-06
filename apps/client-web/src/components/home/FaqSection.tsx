import React from 'react';
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "What is Grow Fitness?",
    a: "Fitness for kids 4+ in Colombo. We build real movement, coordination, strength, and confidence through group sessions, personal training, and preschool partnerships. Screens are replacing movement. We help kids fall back in love with it, and that shift changes everything.",
  },
  {
    q: "What ages do you work with?",
    a: "4 and above. Private training sessions are customised according to the kids objectives and challenges.",
  },
  {
    q: "Is my child safe?",
    a: "Our coaches are ex-professional or ex-schoolboy athletes, all trained through our own program before they touch a session. Many hold external qualifications too. We follow LTAD (Long Term Athlete Development), the global standard for age-appropriate development. Not just safe. World-class.",
  },
  {
    q: "How do I know this actually works?",
    a: "90%+ of kids show visible physical development within 8 weeks. Not self-reported. Visible.",
  },
  {
    q: "Is there a trial session?",
    a: "Yes. You can request a trial first before committing.",
  },
  {
    q: "What if my child stops enjoying it?",
    a: "Rare, but if it happens, tell us. We'll find what's off and fix it. Usually a small change is all it takes. If you think it doesn't fit still, it's easy to discontinue. Simply call us.",
  },
  {
    q: "My child isn't sporty at all. Is this still for them?",
    a: "Especially for them. We're not building athletes. We're building kids comfortable and capable in their own bodies.",
  },
  {
    q: "What's the difference between personal training and group?",
    a: "Personal training is built around your child specifically, strength, coordination, speed, balance, sport prep, etc. We track progress and share progress reports with parents every 2 months.",
  },
];

interface FAQSectionProps {
  openFaq: number | null;
  setOpenFaq: React.Dispatch<React.SetStateAction<number | null>>;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ openFaq, setOpenFaq }) => {
  const toggleFaq = (i: number) => setOpenFaq((s) => (s === i ? null : i));

  return (
    <section className="relative overflow-hidden px-6 md:px-12 py-24" style={{ background: "var(--gf-cream)" }}>
      <img
          src="/images/Grow VI Elements/Icons/Yellow abs.png"
          alt="flower"
          className="absolute w-[360px] opacity-70 pointer-events-none"
          style={{ right: -80, top: -60 }}
        />

      <div className="max-w-[760px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gf-green)" }}>Got questions</p>
          <h2 className="uppercase" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px,5vw,64px)", lineHeight: 0.92, color: "var(--gf-green-deep)" }}>
            FAIR
            <br />
            QUESTIONS.
          </h2>
        </div>

        <div className="flex flex-col">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="gf-faq-row"
              style={{
                borderTop: "1.5px solid var(--line)",
                borderBottom: i === faqs.length - 1 ? "1.5px solid var(--line)" : "none",
              }}
              onClick={() => toggleFaq(i)}
            >
              <div className="flex items-center justify-between gap-6 px-2 py-6 cursor-pointer">
                <p style={{ fontFamily: "var(--font-alt)", fontWeight: 900, fontSize: 19, color: "var(--gf-green-deep)", lineHeight: 1.3 }}>
                  {f.q}
                </p>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--gf-green)", boxShadow: "0 3px 0 var(--gf-green-deep)" }}
                >
                  <ChevronDown
                    size={14}
                    color="white"
                    strokeWidth={3}
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}
                  />
                </div>
              </div>
              {openFaq === i && (
                <div className="px-2 pb-7 -mt-2">
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--fg-2)" }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-11 flex items-center justify-center gap-4 flex-wrap">
          <p style={{ fontSize: 16, color: "var(--fg-2)" }}>More questions?</p>
          <a
            href="https://wa.me/94770569954"
            target="_blank"
            rel="noreferrer"
            className="gf-btn-pop text-[15px] px-6 py-3"
            style={{ color: "white", background: "#25d366", boxShadow: "0 5px 0 #1da851" }}
          >
            WhatsApp us
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
};