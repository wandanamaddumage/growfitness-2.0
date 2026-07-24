const QUOTES = [
  {
    text: "Parents keep asking what else we offer beyond academics.",
    dot: "var(--gf-sun)",
  },
  {
    text: "Every preschool nearby says the same three things about themselves.",
    dot: "var(--gf-sun)",
  },
  {
    text: "None of our staff are trained to run a real fitness program.",
    dot: "var(--gf-green)",
    filled: true,
  },
];

export default function HearThisALot() {
  return (
    <section style={{ background: "var(--gf-cream)" }} className="relative my-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 grid md:grid-cols-2 gap-14 items-start relative">
        <div>
          <span
            className="gf-eyebrow inline-block text-md font-bold mb-8"
            style={{ color: "var(--gf-green)" }}
          >
            FOR PRESCHOOL DIRECTORS
          </span>
          <p className="gf-h-display text-3xl sm:text-4xl md:text-5xl md:text-6xl leading-tight mb-8 font-bold">
            If you run a preschool, you already know this feeling.
          </p>
          <p className="text-lg max-w-[500px]" style={{ color: "var(--fg-2)" }}>
            You&rsquo;re running a preschool. You shouldn&rsquo;t also have to
            become a sports scientist.
          </p>
        </div>

       <div className="flex flex-col gap-4">
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="gf-card-lift rounded-2xl p-5 flex items-start gap-4"
              style={{
                background: "#fff",
                boxShadow: q.filled
                  ? "0 8px 0 var(--gf-green-deep)"
                  : "var(--shadow-1)",
              }}
            >
              <span
                className="w-10 h-10 rounded-md mt-0.5 flex-shrink-0"
                style={{
                  background: q.dot,
                  boxShadow: "0 4px 0 var(--gf-green-deep)",
                }}
              />
              <p className="text-xl font-semibold leading-snug italic">
                &ldquo;{q.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}