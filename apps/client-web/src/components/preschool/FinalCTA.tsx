import { ArrowRight, Clock, Phone } from "lucide-react";
import { TbBrandWhatsapp } from "react-icons/tb";

export default function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gf-sun)" }}
    >
      <div className="mx-auto max-w-4xl px-6 py-20 text-center relative">
        <p
          className="gf-eyebrow text-md font-semibold inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
          style={{ background: "var(--gf-green-deep)", color: "#fff" }}
        >
          <Clock size={18} stroke="var(--gf-leaf)"/>
          RUNNING AT 7 PRESCHOOL — 2 NEW SLOTS OPEN
        </p>

        <h2 className="gf-h-display text-7xl md:text-8xl leading-[1.05] mb-5">
          We&rsquo;ll run your
          <br />
          first session
          <br />
          <span style={{ color: "var(--gf-green)" }}>free.</span>
        </h2>

        <p
          className="text-xl max-w-xl mx-auto mb-8"
          style={{ color: "rgba(25,25,25,0.65)" }}
        >
          Confirm a time, send us a few pictures of your space, and we bring
          everything needed to run it. No cost. No obligation.
        </p>

        <div className="flex justify-center gap-4 mb-16 flex-wrap">
           <button className="gf-btn-pop relative text-white" style={{ marginTop: 36, background: "var(--gf-green-deep)", boxShadow: "0 8px 0 var(--fg-3)", fontSize: 20, padding: "16px 50px" }}>
              <Phone style={{ width: 26, height: 26 }}/>Call Now <ArrowRight size={20} />
            </button>
            <button className="gf-btn-pop relative text-black" style={{ marginTop: 36, background: "var(--gf-cream)", boxShadow: "0 8px 0 var(--fg-3)", fontSize: 20, padding: "16px 50px" }}>
               <TbBrandWhatsapp style={{ width: 26, height: 26, color: "var(--gf-green)" }}/> WhatsApp us
            </button>
        </div>

        <a href="tel:+94770569954" className="font-bold text-2xl font-bold hover:underline">+94 77 056 9954</a>
      </div>
    </section>
  );
}