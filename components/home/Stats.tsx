import { Star } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const STATS: { value: string; label: string; icon?: React.ReactNode }[] = [
  { value: `${BUSINESS.yearsExperience}+`, label: "Years of Experience" },
  { value: String(BUSINESS.happyClients), label: "Happy Clients" },
  { value: String(BUSINESS.totalStyles), label: "Braids & Styles" },
  {
    value: String(BUSINESS.rating),
    label: "Rated on Google",
    icon: <Star size={22} fill="currentColor" strokeWidth={0} />,
  },
];

export default function Stats() {
  return (
    <section className="py-10 px-4 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {STATS.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-3xl lg:text-4xl font-bold inline-flex items-center gap-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>
              {s.value}
              {s.icon}
            </span>
            <span className="text-xs uppercase tracking-wider opacity-70">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
