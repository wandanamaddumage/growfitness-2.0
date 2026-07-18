import { Circle } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--gf-sun)" }}
    >
      {/* <FlowerMark
        className="absolute left-6 top-8 opacity-60 hidden md:block"
        fill="var(--gf-green-deep)"
        size={70}
      />
      <FlowerMark
        className="absolute right-8 bottom-10 opacity-40 hidden md:block"
        fill="var(--gf-green-deep)"
        size={50}
      /> */}
      <div className="mx-auto max-w-[720px] px-6 py-20 text-center relative">
        <span
          className="gf-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{ background: "var(--gf-green-deep)", color: "#fff" }}
        >
          <Circle size={7} fill="var(--gf-green)" color="var(--gf-green)" />
          Running at 7 preschools — 2 new spots open
        </span>

        <h2 className="gf-h-display text-[32px] md:text-[42px] leading-[1.05] mb-5">
          We&rsquo;ll run your
          <br />
          first session
          <br />
          <span style={{ color: "var(--gf-green)" }}>free.</span>
        </h2>

        <p
          className="text-[14.5px] max-w-[400px] mx-auto mb-8"
          style={{ color: "rgba(25,25,25,0.65)" }}
        >
          Confirm a time, send us a few pictures of your space, and we bring
          everything needed to run it. No cost. No obligation.
        </p>

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {/* <PillButton variant="ghostDark">
            <Phone size={15} strokeWidth={2.5} />
            Call Now
            <ChevronRight size={15} strokeWidth={3} />
          </PillButton>
          <PillButton variant="ghostLight">
            <MessageCircle size={15} strokeWidth={2.5} />
            WhatsApp us
          </PillButton> */}
        </div>

        <p className="font-bold text-[15px]">+94 77 056 9954</p>
      </div>
    </section>
  );
}