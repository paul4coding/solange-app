import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { SERVICES, ADDONS, LENGTH_GUIDE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing for all hair braiding services at Solange's Hair Braiding LLC. Knotless braids from $180, box braids from $150, kids styles from $45.",
};

const PACKAGES = [
  {
    name: "Protective Style Package",
    price: "250+",
    save: 20,
    items: ["Wash + Deep Condition", "Knotless Braids", "Take Down Next Time"],
  },
  {
    name: "Kids Special",
    price: "55+",
    save: 10,
    items: ["Kids Braids", "Braids Included", "Edge Styling"],
  },
  {
    name: "Loc Care Package",
    price: "120+",
    save: 15,
    items: ["Loc Retwist", "Loc Maintenance", "Moisturizing Treatment"],
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center py-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-gold)" }}>Pricing</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              BEAUTIFUL STYLES,
            </h1>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--color-primary)" }}>
              FAIR PRICES.
            </h1>
            <p className="text-gray-500 text-sm mb-2 leading-relaxed">Quality service, premium products and styles that last.</p>
            <p className="text-xs text-gray-400 mb-6">Prices may vary depending on hair length, density and design complexity.</p>
            <div className="flex gap-3">
              <Link href="/booking"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--color-primary)" }}>
                <CalendarCheck size={16} /> BOOK YOUR APPOINTMENT
              </Link>
              <Link href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                VIEW SERVICES →
              </Link>
            </div>
          </div>
          {/* Badge */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="w-36 h-36 rounded-full flex flex-col items-center justify-center text-white shadow-xl"
              style={{ backgroundColor: "var(--color-primary)" }}>
              <span className="text-3xl font-bold">15+</span>
              <span className="text-xs text-center opacity-80 px-2">YEARS OF<br />EXPERIENCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service prices */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Braiding Services" title="Service" titleHighlight="Pricing" />
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SERVICES.map((s) => (
              <div key={s.slug} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{s.icon}</div>
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-2 leading-tight">{s.name}</h3>
                <p className="text-lg font-bold mb-1" style={{ color: "var(--color-primary)" }}>${s.startingPrice}+</p>
                <p className="text-xs text-gray-400">Starting at<br />{s.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons + Length guide + Packages */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Add-ons */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm border-b border-gray-100 pb-3">
              Add-Ons
            </h3>
            <ul className="space-y-3">
              {ADDONS.map((a, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <span className="text-[#C9A96E]">◆</span> {a.name}
                  </span>
                  <span className="font-semibold text-gray-900">${a.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Length guide */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm border-b border-gray-100 pb-3">
              Length Guide (Braids)
            </h3>
            <ul className="space-y-3">
              {LENGTH_GUIDE.map((l, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{l.length}</span>
                  <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
                    {l.add === 0 ? "$ (Base Price)" : `+ $${l.add}`}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mt-3">Prices are starting rates. Final price determined during consultation.</p>
          </div>

          {/* Special packages */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">Special Packages</h3>
            <div className="space-y-4">
              {PACKAGES.map((pkg, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-gray-900">{pkg.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "var(--color-gold)" }}>
                      SAVE ${pkg.save}
                    </span>
                  </div>
                  <ul className="text-xs text-gray-500 mb-3 space-y-1">
                    {pkg.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-1.5">
                        <span style={{ color: "var(--color-primary)" }}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>${pkg.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Satisfaction banner */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 rounded-2xl p-8"
          style={{ backgroundColor: "var(--color-primary)" }}>
          <div className="text-white text-center lg:text-left">
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>SATISFACTION GUARANTEED</h3>
            <p className="text-sm opacity-80">Your satisfaction is our priority. We don't stop until you love your hair!</p>
          </div>
          <div className="text-white text-center">
            <p className="text-sm opacity-70 mb-1">Walk-ins Welcome</p>
            <p className="text-sm font-semibold">Appointments Recommended</p>
          </div>
          <Link href="/booking"
            className="text-sm font-semibold px-6 py-3 rounded-lg border-2 border-white text-white hover:bg-white hover:text-[#8B1A1A] transition-all whitespace-nowrap">
            BOOK NOW
          </Link>
        </div>
      </section>
    </>
  );
}
