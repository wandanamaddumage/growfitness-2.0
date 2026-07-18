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
          <span
              className="gf-eyebrow inline-block mb-5 font-bold text-sm"
              style={{ color: "var(--gf-green)" }}
            >
              THE BUSINESS CASE
            </span>
          <h1 className="gf-h-display text-6xl md:text-6xl max-w-2xl mx-auto">
            Why preschools partner with us.
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="gf-card-lift rounded-3xl p-10 py-12"
              style={{
                background: c.dark ? "var(--gf-green-deep)" : "var(--gf-cream)",
                boxShadow: "var(--shadow-1)",
              }}
            >
              <span
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-5"
                style={{ 
                  background: c.dot,
                  boxShadow: "0 4px 0 var(--gf-green-deep)",
                }}
              >
              </span>
              <p
                className={`font-bold text-2xl mb-2 leading-snug ${
                  c.dark ? "text-white" : ""
                }`}
              >
                {c.title}
              </p>
              <p
                className="text-lg leading-relaxed mt-6"
                style={{ color: c.dark ? "var(--gf-leaf)" : "var(--fg-2)" }}
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