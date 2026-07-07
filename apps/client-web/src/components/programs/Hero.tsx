import { Squiggle } from "./common/Squiggle";
import { Mascot } from "./common/Mascot";

export function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--gf-green-deep)" }}>
      <img
        src="/images/Grow VI Elements/Icons/Yellow abs.png"
        alt="flower"
        className="absolute w-[360px] opacity-10 pointer-events-none animate-spin-slow"
        style={{ right: -60, top: -80 }}
      />
      <img
        src="/images/Grow VI Elements/Icons/Mix abs.png"
        alt="Mix Abs"
        className="absolute w-[240px] opacity-10 pointer-events-none"
        style={{ left: -40, bottom: -20 }}
      />
      <Squiggle className="absolute -right-6 top-10 h-40 w-40" opacity={0.12} />
      {/* <img
          src="/images/Grow VI Elements/Icons/Grow buddy.png"
          alt="mix abs"
          className="absolute w-[320px] pointer-events-none z-10 animate-bounce"
          style={{ right: 150, bottom: -50, color: "var(--gf-sun)" }}
        /> */}
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
        <div>
          <div
            className="mb-6 inline-flex w-fit items-center rounded-full px-5 py-2"
            style={{
              background: "var(--gf-sun)",
              border: "2px solid var(--gf-green-deep)",
              boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
            }}
          >
            <span
              className="mr-2 inline-block h-2 w-2 rotate-45"
              style={{ backgroundColor: "var(--gf-green-deep)" }}
            />
            <span
              className="font-bold text-[13px]"
              style={{ color: "var(--gf-green-deep)" }}
            >
              FOR KIDS AGED 4 TO 12
            </span>
          </div> 
          <h1
            className="text-6xl font-extrabold uppercase leading-[0.95] tracking-tight text-white md:text-8xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Two ways
            <br />
            <span style={{ color: "var(--gf-sun)" }}>to train.</span>
          </h1>
          <p className="mt-6 flex items-center gap-2 text-4xl font-semibold" style={{ color: "var(--gf-leaf)" }}>
            Pick what fits your kid.
          </p>
        </div>
        <Mascot />
      </div>
    </section>
  );
}