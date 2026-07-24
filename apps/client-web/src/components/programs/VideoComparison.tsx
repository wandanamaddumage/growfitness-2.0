import { MessageCircle, Heart } from "lucide-react";

export function VideoComparison() {
  return (
    <section className="px-6 py-16" style={{ backgroundColor: "var(--gf-ink)" }}>
      <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-white/50">
        See both programs in action
      </p>

      <div
        className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* Group Sessions */}
          <div
            className="flex h-[60vh] min-h-[500px] max-h-[750px] flex-col items-center justify-center gap-5 opacity-80"
            style={{ backgroundColor: "rgba(35,182,133,0.18)" }}
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--gf-green)",
                color: "white",
              }}
            >
              <MessageCircle size={34} />
            </span>

            <p className="text-center text-3xl font-extrabold uppercase text-white">
              Group
              <br />
              <span style={{ color: "var(--gf-green)" }}>
                Sessions
              </span>
            </p>

            <p className="text-sm text-white/40">
              Video coming soon
            </p>
          </div>

          {/* Personal Training */}
          <div
            className="flex h-[60vh] min-h-[500px] max-h-[750px] flex-col items-center justify-center gap-5 opacity-80"
            style={{ backgroundColor: "rgba(255,253,119,0.05)" }}
          >
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--gf-sun)",
                color: "var(--gf-ink)",
              }}
            >
              <Heart size={34} />
            </span>

            <p className="text-center text-3xl font-extrabold uppercase text-white">
              Personal
              <br />
              <span style={{ color: "var(--gf-sun)" }}>
                Training
              </span>
            </p>

            <p className="text-sm text-white/40">
              Video coming soon
            </p>
          </div>

          {/* VS Badge */}
          <span
            className="absolute left-1/2 top-1/2 flex h-12 w-12 opacity-80 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-base font-bold uppercase text-black"
            style={{
              backgroundColor: "white",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            VS
          </span>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-md text-center text-xs text-white/30">
        Drop your video file here once it&apos;s ready. One file, split-screen
        edit, under 90 seconds.
      </p>
    </section>
  );
}