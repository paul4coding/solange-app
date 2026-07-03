import Link from "next/link";
import { CalendarCheck, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function CTABanner() {
  return (
    <section className="py-14 px-4 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-sm opacity-70 uppercase tracking-widest mb-2">Ready to Look & Feel Your Best?</p>
        <h2
          className="text-3xl lg:text-4xl font-bold mb-2"
          style={{ fontFamily: "'Great Vibes', cursive" }}
        >
          Book Your Appointment Today!
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg border-2 border-white/50 hover:bg-white hover:text-[#8B1A1A] transition-all"
          >
            <CalendarCheck size={16} />
            BOOK APPOINTMENT NOW
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <a href={`tel:${BUSINESS.phone1Raw}`} className="flex items-center gap-2 hover:text-yellow-200 transition-colors font-semibold">
              <Phone size={15} />
              {BUSINESS.phone1}
            </a>
            <span className="hidden sm:inline opacity-40">|</span>
            <a href={`tel:${BUSINESS.phone2Raw}`} className="flex items-center gap-2 hover:text-yellow-200 transition-colors font-semibold">
              <Phone size={15} />
              {BUSINESS.phone2}
            </a>
          </div>
        </div>

        <p className="text-xs opacity-50 mt-4">Walk-ins welcome · Appointments recommended</p>
      </div>
    </section>
  );
}
