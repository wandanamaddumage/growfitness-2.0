import { Check, Plus, Calendar, ArrowRight, Info, Users } from "lucide-react";
import { Pill } from "./common/Pill";
import { CheckItem } from "./common/CheckItem";

export function ProgramCards() {
  return (
    <section className="relative px-6 py-20" style={{ backgroundColor: "var(--gf-cream)" }}>
       <img
        src="/images/Grow VI Elements/Icons/Yellow abs.png"
        alt="flower"
        className="absolute w-[360px] pointer-events-none opacity-50"
        style={{ left: -70, bottom: -90}}
      />
      <div className="mx-auto flex max-w-6xl items-center md:grid md:grid-cols-2">
       
      </div>

      <div className="mx-auto mt-6 grid max-w-6xl gap-6 md:grid-cols-2" style={{ position: 'relative', zIndex: 1 }}>
        {/* Group Sessions Card */}
        <div>
          <div className="my-4">
            <Pill variant="sun">
              <Check size={12} strokeWidth={3} /> MOST KIDS START HERE
            </Pill>
          </div>
         
         <div 
          className="overflow-hidden rounded-3xl bg-white gf-card-lift"
          style={{ 
            border: `3px solid var(--gf-ink)`,
            boxShadow: "0 6px 0 rgba(19,32,24,0.9)"
          }}
        >
          <div className="relative px-7 pb-8 pt-7" style={{ backgroundColor: "var(--gf-green)", position: 'relative', zIndex: 1}}>
             <img
              src="/images/Grow VI Elements/Icons/Heart g.png"
              alt="Mix Abs"
              className="absolute w-[90px] pointer-events-none"
              style={{ right: 20, top: 20 }}
            />
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">Group Sessions</p>
            <h3
              className="mt-2 text-5xl font-extrabold uppercase leading-tight text-white text-left w-2/3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              For kids who want a fun way to start fitness.
            </h3>
            <div className="mt-4 flex gap-2">
              <div className="px-4 py-1 font-bold bg-green-100/10 rounded-full" style={{ backgroundColor: "var(--fg-4)", color: "var(--gf-cream)", position: 'relative', zIndex: 1}}>Ages 4 to 12</div>
              <div className="px-4 py-1 font-bold bg-green-100/10 rounded-full" style={{ backgroundColor: "var(--fg-4)", color: "var(--gf-cream)", position: 'relative', zIndex: 1}}>1 hr per session</div>
            </div>
            <img
              src="/images/Grow VI Elements/Icons/Mix abs 2.png"
              alt="Mix Abs"
              className="absolute w-[200px] opacity-30 pointer-events-none"
              style={{ right: 10, bottom: -20 }}
            />
          </div>

          <div className="space-y-5 px-7 py-7">
           <div className="divide-y" style={{ borderColor: "var(--gf-ink)" }}>
            <div className="py-4">
              <CheckItem
                title="6 kids per coach"
                desc="Small enough that every kid is seen. Big enough to bring the energy."
              />
            </div>

            <div className="py-4">
              <CheckItem
                title="Saturdays, 4 locations"
                desc="Find a spot near you. Same great session everywhere."
              />
            </div>

            <div className="py-4">
              <CheckItem
                title="Agility, strength, balance"
                desc="Built through play. No drills, no lectures. Just moving."
              />
            </div>
          </div>

            <div className="flex items-start gap-3 rounded-2xl px-6 py-6" style={{ 
              backgroundColor: "var(--gf-sun)",
              border: `3px solid var(--gf-ink)`,
              boxShadow: "0 6px 0 rgba(19,32,24,0.9)"
            }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "var(--gf-green-deep)" }}>
                <Users size={14} style={{ color: "var(--gf-sun)", backgroundColor: "var(--gf-green-deep)" }} />
              </span>
              <div>
                <p className="text-md font-bold" style={{ color: "var(--gf-ink)" }}>Only 30 spots per batch</p>
                <p className="text-md" style={{ color: "var(--gf-ink)", opacity: 0.75 }}>
                  Batches fill up fast. Check if there&apos;s still a spot for your kid.
                </p>
              </div>
            </div>

            <div className="rounded-2xl px-6 py-6" style={{ 
              backgroundColor: "var(--gf-green-50)",
              border: `1px solid var(--gf-ink)`,
              boxShadow: "-6px 0 0 var(--gf-green)"
            }}>
              
              <p className="text-lg italic leading-relaxed" style={{ color: "var(--gf-ink)" }}>
                “They&apos;ll start to love physical activities and gain confidence doing them.”
              </p>
            </div>

            <a
              href="/free-session"
              className="gf-btn-pop text-[18px] px-10 py-[18px]"
              style={{ color: "white", background: "var(--gf-green)", boxShadow: "0 8px 0 var(--gf-green-deep)" }}
            >
              Try out a free session
              <ArrowRight size={18} strokeWidth={2.5} />
            </a>
          </div>
        </div>
        </div>
       

        {/* Personal Training Card */}
        <div>
           <p className="my-4 text-sm italic text-left items-start self-start" style={{ color: "var(--fg-3)" }}>
          For kids who need dedicated attention first
        </p>
          <div 
          className="overflow-hidden rounded-3xl bg-white gf-card-lift"
          style={{ 
            border: `3px solid var(--gf-ink)`,
            boxShadow: "0 6px 0 rgba(19,32,24,0.9)"
          }}
        >
       
          <div className="relative px-7 pb-8 pt-6" style={{ backgroundColor: "var(--gf-ink)" }}>
            <img
              src="/images/Grow VI Elements/Icons/Cup y.png"
              alt="Mix Abs"
              className="absolute w-[90px] pointer-events-none"
              style={{ right: 20, top: 20 }}
            />
            <Pill variant="sun" className="mb-3">
              <Plus size={12} strokeWidth={3} /> 1-ON-1
            </Pill>
             <h3
              className="mt-2 text-5xl font-extrabold uppercase leading-tight text-white text-left w-2/3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              For kids who need individual attention
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: "var(--fg-2)", color: "var(--gf-leaf)" }}>Weekday sessions</div>
              <div className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: "var(--fg-2)", color: "var(--gf-leaf)" }}>1 hr / session</div>
            </div>
            <div className="mt-3 text-md">
              <Pill variant="sun" className="text-md">Under 4 or over 18? Start here.</Pill>
            </div>
            <img
              src="/images/Grow VI Elements/Icons/Mix abs.png"
              alt="Mix Abs"
              className="absolute w-[200px] opacity-30 pointer-events-none"
              style={{ right: -30, bottom: -30 }}
            />
          </div>
            <div style={{ height: 5, backgroundColor: "var(--gf-sun)" }} />

          <div className="space-y-5 px-7 py-7">
           <div className="divide-y" style={{ borderColor: "var(--gf-ink)" }}>
          <div className="py-4">
            <CheckItem
              title="We start with an assessment"
              desc="Before the first session, we get to know your kid. Their strengths, gaps, and what they actually enjoy."
              bgColor="var(--gf-sun)"
              checkColor="var(--gf-ink)"
            />
          </div>

          <div className="py-4">
            <CheckItem
              title="A plan built just for them"
              desc="No templates. Every session follows a customised workout plan designed around your child's specific goals."
              bgColor="var(--gf-sun)"
              checkColor="var(--gf-ink)"
            />
          </div>

          <div className="py-4">
            <CheckItem
              title="Bi-monthly progress reports"
              desc="Parents receive a detailed update every two months. You'll always know exactly how your kid is growing."
              bgColor="var(--gf-sun)"
              checkColor="var(--gf-ink)"
            />
          </div>
        </div>
            <div className="rounded-2xl px-6 py-4" style={{ 
              backgroundColor: "var(--gf-sun)",
              border: `3px solid var(--gf-ink)`,
              boxShadow: "0 6px 0 rgba(19,32,24,0.9)"
            }}>
              <p className="text-md font-semibold italic leading-relaxed" style={{ color: "var(--gf-ink)" }}>
                “They will be perform better at any sport or any form of physical activity within 12 or less weeks.”
              </p>
            </div>

            <button
               className="gf-btn-pop text-[18px] px-10 py-[18px]"
              style={{ color: "black", background: "var(--gf-sun)", boxShadow: "0 8px 0 var(--gf-ink)" }}
              onClick={() => window.location.href = '/free-session'}
            >
              Book a free assessment <Calendar size={20} />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Not sure box */}
      <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white px-8 py-6" style={{ border: "1px solid rgba(19,32,24,0.08)", position: 'relative', zIndex: 1 }}>
        <div className="flex gap-3">
          <span 
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--gf-green-50)", color: "var(--gf-green)" }}
          >
            <Info size={15} />
          </span>
          <div>
            <p className="font-bold" style={{ color: "var(--gf-ink)" }}>Not sure which one to choose?</p>
            <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--fg-2)" }}>
              Group Sessions are for kids aged 4 to 12. If your child is outside that range, or needs more focused attention, Personal Training is the right fit regardless of age. Not sure? Message us and we will point you in the right direction.
            </p>
          </div>
        </div>
      </div>
     
    </section>
  );
}