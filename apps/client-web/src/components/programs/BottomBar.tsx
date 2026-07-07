export function BottomBar() {
  return (
    <section className="px-6 py-14" style={{ backgroundColor: "var(--gf-cream)" }}>
      <div
        className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-1 rounded-3xl border px-6 py-9 text-md text-center"
        style={{
          borderColor: "rgba(19,32,24,0.12)",
          color: "var(--gf-ink)",
          backgroundColor: "white",
        }}
      >
        <span>Have a child with special needs?</span>

        <a
          href="#"
          className="font-bold underline underline-offset-4"
          style={{
            color: "var(--gf-green)",
            textDecoration: "underline",
          }}
        >
          message us
        </a>
      </div>
    </section>
  );
}