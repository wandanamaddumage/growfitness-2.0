import { Play } from "lucide-react";

export default function SeeItInAction() {
  return (
    <section style={{ background: "var(--gf-green-deep)" }}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 pt-16">
         <span
            className="gf-eyebrow inline-block text-md font-bold my-8"
            style={{ color: "var(--gf-leaf)" }}
          >
            SEE IT IN ACTION
          </span>
        <p className="gf-h-display font-bold text-white text-4xl md:text-5xl mb-8">
          What a real session looks like.
        </p>

        <div
          className="rounded-3xl h-[380px] md:h-[420px] flex flex-col items-center justify-center gap-4"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <button
            className="w-16 h-16 rounded-full flex items-center justify-center gf-card-lift"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <Play size={22} color="#fff" fill="#fff" />
          </button>
          <p className="text-white font-bold text-2xl">
            See a session in action
          </p>
          <p
            className="text-xl text-center max-w-[400px]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Drop in session footage or a photo here — real kids, mid-activity.
          </p>
        </div>
      </div>
    </section>
  );
}