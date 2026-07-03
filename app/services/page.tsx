import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Professional hair braiding services in Glen Burnie, MD. Knotless braids, box braids, boho braids, twists, locs & more. Starting at $45.",
};

const CATEGORIES = [
  { id: "braids", label: "Braids" },
  { id: "twists", label: "Twists" },
  { id: "cornrows", label: "Cornrows" },
  { id: "kids", label: "Kids Styles" },
  { id: "locs", label: "Locs" },
  { id: "weaves", label: "Weaves" },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle at 70% 50%, #C9A96E 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center py-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-gold)" }}>Our Services</p>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our <span style={{ fontFamily: "'Great Vibes', cursive", color: "var(--color-primary)" }}>Services</span>
            </h1>
            <p className="text-gray-500 text-sm mb-6 max-w-md leading-relaxed">
              Specialized in all braids, twists, weaves & more. Designed to bring out your best.
            </p>
            <Link href="/booking"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-primary)" }}>
              <CalendarCheck size={16} /> BOOK APPOINTMENT
            </Link>
          </div>
          <div className="hidden lg:block h-48 rounded-2xl overflow-hidden">
            <img src="/images/salon/salon-interior.jpg" alt="Salon" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Hair Braiding Services" title="All Our" titleHighlight="Services" />

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                {/* Image circle */}
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 flex items-center justify-center text-3xl"
                  style={{ background: "linear-gradient(135deg, #FDF8F3, #C9A96E22)", border: "2px solid #C9A96E33" }}>
                  {service.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">{service.name}</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
                    FROM ${service.startingPrice}+
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(139,26,26,0.08)", color: "var(--color-primary)" }}>
                    LEARN MORE →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-4" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-4xl mx-auto text-center rounded-2xl p-10" style={{ backgroundColor: "var(--color-primary)" }}>
          <p className="text-white/70 text-sm mb-2">Not sure what to choose?</p>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Let Us Help You Find The Perfect Style.
          </h2>
          <p className="text-white/70 text-sm mb-6">Book a consultation and our stylist will help you choose the best look for you.</p>
          <Link href="/booking"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg border-2 border-white/50 text-white hover:bg-white hover:text-[#8B1A1A] transition-all">
            <CalendarCheck size={16} /> BOOK A CONSULTATION
          </Link>
        </div>
      </section>
    </>
  );
}
