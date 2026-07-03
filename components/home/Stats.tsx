import { BUSINESS } from "@/lib/constants";

const STATS = [
  { value: `${BUSINESS.yearsExperience}+`, label: "Years of Experience" },
  { value: BUSINESS.happyClients, label: "Happy Clients" },
  { value: BUSINESS.totalStyles, label: "Braids & Styles" },
  { value: `${BUSINESS.rating}★`, label: "Rated on Google" },
];

export default function Stats() {
  return (
    <section className="py-10 px-4 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {STATS.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-3xl lg:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              {s.value}
            </span>
            <span className="text-xs uppercase tracking-wider opacity-70">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
