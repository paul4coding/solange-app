"use client";
import { Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { BUSINESS, REVIEWS } from "@/lib/constants";

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: "#FDF8F3" }}>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="What Our Clients Say"
          title="Client"
          titleHighlight="Love ♡"
        />

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
              <StarRating count={r.rating} />
              <p className="text-sm text-gray-600 mt-3 mb-4 leading-relaxed italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-8 text-center flex items-center justify-center gap-6 flex-wrap">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-gray-900">{BUSINESS.rating}.0</span>
              <div className="flex flex-col gap-0.5">
                <StarRating />
                <span className="text-xs text-gray-400">Based on {BUSINESS.ratingCount} Google reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
