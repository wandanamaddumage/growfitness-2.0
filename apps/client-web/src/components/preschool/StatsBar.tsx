export default function StatsBar() {
  const stats = [
    { n: "7+", l: "Preschools & branches" },
    { n: "300+", l: "Kids in group sessions" },
    { n: "75+", l: "Kids in personal training" },
  ];
  
  return (
  <section
  className="relative z-50 -mt-16"
  style={{ background: "var(--gf-green)" }}
>
  <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-9 grid grid-cols-3 divide-x divide-white/25 rounded-3xl shadow-2xl">
    {stats.map((s) => (
      <div key={s.l} className="text-center px-2">
        <h2 className="gf-h-display text-white text-5xl md:text-6xl font-bold">
          {s.n}
        </h2>
        <p className="text-white/85 text-lg font-semibold mt-1">
          {s.l}
        </p>
      </div>
    ))}
  </div>
</section>
  );
}