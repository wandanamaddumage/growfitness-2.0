import { Eyebrow, NumberBadge } from "./SharedComponents";

const TIMELINE = [
  {
    number: "1",
    badgeColor: "var(--gf-green)",
    title: "Kids had stopped moving",
    body: "Kids were reaching for screens before a ball, losing confidence before they'd even tried. We kept seeing it and kept thinking someone should do something about it properly."
  },
  {
    number: "2",
    badgeColor: "var(--gf-sun)",
    title: "One kid changed everything",
    body: "High energy, wouldn't follow instructions. The kind of kid other programs give up on. Eight weeks later, he was leading warm-ups. We gave that energy somewhere real to go."
  },
  {
    number: "3",
    badgeColor: "var(--gf-green)",
    title: "Started on a beach in 2023",
    body: "Just 2 kids. No big launch, just a belief that if we got the sessions right, word would spread. Today we run across Kirulapone, Colpetty, Nawala, and Dehiwala."
  },
  {
    number: "4",
    badgeColor: "var(--gf-leaf)",
    title: "We don't have it all figured out",
    body: "Some days the doubt creeps in. We think that's healthy. Then a parent messages out of nowhere just to say thank you, and we remember why we built this."
  }
];

export default function WhyWeStarted() {
  return (
    <section style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 24px" }}>
      
      <style>{`
        .timeline-item {
          position: relative;
        }

        .timeline-item::after {
          content: "";
          position: absolute;
          top: 28px;
          left: 56px;
          right: -40px;
          height: 2px;
          background: rgba(28, 43, 28, 0.18);
          z-index: 0;
        }

        .timeline-item:last-child::after {
          display: none;
        }

        .timeline-item > * {
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .timeline-item::after {
            display: none;
          }
        }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <Eyebrow>Part One</Eyebrow>

        <h2 
          className="text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-6xl"
          style={{
            marginTop: 8,
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            color: "var(--gf-green-deep)"
          }}
        >
          Why we started
        </h2>
      </div>


      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 40
      }}>
        {TIMELINE.map((item) => (
          <div 
            key={item.title}
            className="timeline-item"
          >
            <NumberBadge 
              number={parseInt(item.number)} 
              color={item.badgeColor} 
            />

            <p style={{
              marginTop: 20,
              fontSize: 22,
              fontWeight: 900,
              color: "var(--gf-green-deep)"
            }}>
              {item.title}
            </p>

            <p style={{
              marginTop: 8,
              fontSize: 17,
              lineHeight: 1.6,
              color: "var(--fg-2)"
            }}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}