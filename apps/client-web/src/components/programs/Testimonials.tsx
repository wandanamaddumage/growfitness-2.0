import { TestimonialCard } from './common/TestimonialCard'

export function Testimonials() {
  return (
    <section className="relative overflow-hidden px-6 py-20" style={{ backgroundColor: "#eef4e6" }}>
       <img
        src="/images/Grow VI Elements/Icons/Mix abs 2.png"
        alt="Mix Abs"
        className="absolute w-[240px] opacity-30 pointer-events-none"
        style={{ right: 10, top: -20 }}
      />
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gf-green)" }}>
          Real families
        </p>
        <h2
          className="mt-2 text-5xl font-bold"
          style={{ fontFamily: "var(--font-sans-bold)", color: "var(--gf-ink)" }}
        >
          What parents say
        </h2>
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
        <TestimonialCard
          tag="Personal Training Sessions"
          quote="He is 13 years old, we used to buy T-shirts that fit a 7 year old (before Grow Fitness / growth deficiency). Now we buy clothes that fit a 10 year old."
          name="Mrs. Vithu"
          parentOf="Parent of Akashth"
        />
        <TestimonialCard
          tag="Group Sessions"
          quote="My four-year-old enjoys it so much that he never wants to miss a session. He looks forward to meeting the coaches and genuinely enjoys every workout. I've already noticed a real difference in him. He's more active, stronger, and even more confident in trying to lift and do things on his own."
          name="Mrs. Kushlani"
          parentOf="Parent of Nithil"
          highlighted
        />
        <TestimonialCard
          tag="Personal Training + Group Training"
          quote="I can't recommend Grow Fitness enough! Since joining, I've seen such a positive change in my son, not just physically, but in his confidence and overall attitude too. He attends both group training sessions and personal training, and the difference it has made is truly amazing."
          name="Mrs. Ayisha Nalir"
          parentOf="Parent of Aadam"
        />
      </div>
    </section>
  );
}