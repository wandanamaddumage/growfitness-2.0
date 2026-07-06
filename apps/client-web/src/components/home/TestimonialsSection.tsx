import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { StarRow } from "./common/StarRow";
import type { Testimonial } from "@grow-fitness/shared-types";
import { testimonialsService } from "@/services/testimonials.service";

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialsService.getTestimonials(1, 10, true);
      setTestimonials(response.data);
    } catch (error) {
      console.error("Failed to fetch testimonials", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 text-center">
        Loading testimonials...
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 py-24"
      style={{ background: "var(--gf-leaf-50)" }}
    >
      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p
            className="font-bold text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--gf-green)" }}
          >
            Real families, real results
          </p>

          <h2
            style={{
              fontFamily: "var(--font-alt)",
              fontWeight: 900,
              fontSize: 48,
              color: "var(--gf-green-deep)",
            }}
          >
            What parents are saying
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, index) => {
            const isFeatured = index === 1;

            return (
              <div
                key={t.id}
                className="gf-card-lift rounded-[32px] p-9"
                style={
                  isFeatured
                    ? {
                        background: "white",
                        border: "3px solid var(--gf-green-deep)",
                        boxShadow: "var(--shadow-pop)",
                      }
                    : {
                        background: "white",
                        border: "1.5px solid var(--line)",
                        boxShadow: "var(--shadow-2)",
                      }
                }
              >
                {/* Top Review Badge (middle card only) */}
                {isFeatured && (
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
                    style={{
                      background: "var(--gf-sun)",
                      border: "1.5px solid var(--gf-green-deep)",
                    }}
                  >
                    <span
                      className="font-bold text-[11px] uppercase tracking-widest"
                      style={{ color: "var(--gf-green-deep)" }}
                    >
                      Top Review
                    </span>
                  </div>
                )}

                <StarRow />

                {/* Testimonial text */}
                <p
                  className="italic mb-7"
                  style={{
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: "var(--fg-1)",
                  }}
                >
                  {t.content}
                </p>

                {/* Author */}
                <div
                  className="flex items-center gap-3 pt-5"
                  style={{ borderTop: "1px solid var(--line)" }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "var(--gf-green-100)",
                      border: "2px solid var(--line)",
                    }}
                  >
                    <Users size={26} color="#23b685" strokeWidth={1.5} />
                  </div>

                  <div>
                    <p
                      className="font-bold text-[15px]"
                      style={{ color: "var(--gf-green-deep)" }}
                    >
                      {t.authorName}
                    </p>

                    {t.childName && (
                      <p
                        className="text-[13px]"
                        style={{ color: "var(--fg-3)" }}
                      >
                        {t.childName}
                        {t.childAge && `, age ${t.childAge}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};