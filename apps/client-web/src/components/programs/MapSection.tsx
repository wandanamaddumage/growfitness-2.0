import { LocationRow } from './common/LocationRow'

export function MapSection() {
  return (
    <section className="px-6 py-20" style={{ backgroundColor: "var(--gf-green-deep)" }}>
      <div className="mx-auto max-w-6xl">
        <h2
          className="text-4xl font-extrabold uppercase leading-tight text-white md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Where we
          <br />
          <span style={{ color: "var(--gf-sun)" }}>host sessions.</span>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div
            className="relative h-96 overflow-hidden rounded-3xl"
            style={{ backgroundColor: "#16281f", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 400">
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="white" strokeWidth="1" />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} stroke="white" strokeWidth="1" />
              ))}
            </svg>
            {[
              { label: "Independence Square", top: "18%", left: "38%", type: "personal" },
              { label: "Colpetty · Our office", top: "34%", left: "26%", type: "both" },
              { label: "Nawala", top: "36%", left: "58%", type: "group" },
              { label: "Kirulapone", top: "56%", left: "44%", type: "group" },
              { label: "Dehiwala", top: "78%", left: "34%", type: "group" },
            ].map((pin) => (
              <div
                key={pin.label}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5"
                style={{ top: pin.top, left: pin.left }}
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full ring-4"
                  style={{
                    backgroundColor: pin.type === "personal" ? "var(--gf-green)" : "var(--gf-sun)",
                    boxShadow: "0 0 0 4px rgba(255,255,255,0.08)",
                  }}
                />
                <span className="whitespace-nowrap rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {pin.label}
                </span>
              </div>
            ))}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[11px] text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--gf-sun)" }} /> Group Sessions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--gf-green)" }} /> Personal Training
              </span>
            </div>
            <p className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] tracking-[0.3em] text-white/25">
              INDIAN OCEAN
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <LocationRow name="Colpetty" sub="Saturdays · Colombo 3" />
            <LocationRow name="Kirulapone" sub="Saturdays · Colombo 6" />
            <LocationRow name="Nawala" sub="Saturdays · Nawala" />
            <LocationRow name="Dehiwala" sub="Saturdays · Dehiwala" />
            <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-widest text-white/40">
              Personal Training
            </p>
            <LocationRow name="Independence Square" sub="Any day · Colombo 7" />
            <LocationRow name="Our office" sub="Any day · Colombo" />
          </div>
        </div>
      </div>
    </section>
  );
}