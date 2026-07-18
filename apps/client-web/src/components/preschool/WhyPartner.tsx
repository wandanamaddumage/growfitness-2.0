import { Check } from "lucide-react";

export default function WhyPartner() {
  const cards = [
    {
      title: "The only program of its kind here",
      body: (
        <>
          Built on <b>LTAD</b>, the global standard for children&rsquo;s
          athletic development. Your competitors can&rsquo;t say this.
        </>
      ),
      dark: false,
      dot: "var(--gf-green)",
    },
    {
      title: "Parents choose the preschool doing more",
      body:
        "When two preschools are equal on academics, a structured fitness program tips the decision.",
      dark: true,
      dot: "var(--gf-sun)",
    },
    {
      title: "Parents bring it up unprompted",
      body:
        'Parents and directors tell us that "fitness day" has become their kids favourite day for pre-school. Parents bring it up!',
      dark: false,
      dot: "var(--gf-green)",
    },
  ];

  return (
    <section style={{ background: "#fff" }}>
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20">
        <div className="text-center mb-12">
          {/* <Eyebrow color="var(--gf-green)" className="justify-center flex">
            The business case
          </Eyebrow> */}
          <h2 className="gf-h-display text-[28px] md:text-[38px]">
            Why preschools partner with us.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="gf-card-lift rounded-2xl p-7"
              style={{
                background: c.dark ? "var(--gf-green-deep)" : "var(--gf-cream)",
                boxShadow: "var(--shadow-1)",
              }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-5"
                style={{ background: c.dot }}
              >
                <Check size={15} color="var(--gf-green-deep)" strokeWidth={3} />
              </span>
              <h3
                className={`font-bold text-[16px] mb-2 leading-snug ${
                  c.dark ? "text-white" : ""
                }`}
              >
                {c.title}
              </h3>
              <p
                className="text-[13.5px] leading-relaxed"
                style={{ color: c.dark ? "rgba(255,255,255,0.7)" : "var(--fg-2)" }}
              >
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}