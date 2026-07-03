import { Metadata } from "next";
import Link from "next/link";
import { Plus, Minus, Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { FAQS, BUSINESS } from "@/lib/constants";

export const metadata: Metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[38vh] flex items-center overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center py-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-gold)" }}>FAQs</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>YOU ASK,</h1>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "var(--color-primary)" }}>WE ANSWER.</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Find answers to common questions about our services, booking, and more.
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-end">
            <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-xl"
              style={{ backgroundColor: "var(--color-primary)" }}>
              <span className="text-3xl font-bold">{BUSINESS.yearsExperience}+</span>
              <span className="text-xs text-center opacity-80 px-2">YEARS OF<br />EXPERIENCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ sections + sidebar */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
          {/* FAQs — pure <details>, no JS */}
          <div className="lg:col-span-2 space-y-8">
            {[
              { title: "General Questions", items: FAQS.general },
              { title: "Booking & Appointments", items: FAQS.booking },
              { title: "Hair Care & Aftercare", items: FAQS.hairCare },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b border-gray-100"
                  style={{ color: "var(--color-primary)" }}>
                  {section.title}
                </h2>
                <div>
                  {section.items.map((faq, i) => (
                    <details key={i} className="group border-b border-gray-100 last:border-0">
                      <summary className="flex items-center justify-between py-4 cursor-pointer list-none select-none">
                        <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                        <Plus
                          size={15}
                          className="shrink-0 block group-open:hidden"
                          style={{ color: "var(--color-primary)" }}
                        />
                        <Minus
                          size={15}
                          className="shrink-0 hidden group-open:block"
                          style={{ color: "var(--color-primary)" }}
                        />
                      </summary>
                      <p className="text-sm text-gray-500 pb-4 leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem" }}>
                Still have Questions?
              </h3>
              <p className="text-sm text-gray-500 mb-4">We're here to help! Reach out to us directly.</p>
              <div className="space-y-3">
                <a href={`tel:${BUSINESS.phone1Raw}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#8B1A1A] transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(139,26,26,0.08)" }}>
                    <Phone size={14} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Call Us</p>
                    <p className="font-semibold">{BUSINESS.phone1}</p>
                    <p className="font-semibold">{BUSINESS.phone2}</p>
                  </div>
                </a>
                <a href={`https://wa.me/${BUSINESS.whatsapp}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#8B1A1A] transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(139,26,26,0.08)" }}>
                    <MessageCircle size={14} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">WhatsApp Us</p>
                    <p className="font-semibold">{BUSINESS.phone1}</p>
                  </div>
                </a>
                <a href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#8B1A1A] transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(139,26,26,0.08)" }}>
                    <Mail size={14} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Email Us</p>
                    <p className="font-semibold text-xs break-all">{BUSINESS.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(139,26,26,0.08)" }}>
                    <MapPin size={14} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Visit Us</p>
                    <p className="text-xs">{BUSINESS.address}</p>
                  </div>
                </div>
              </div>
              <Link href="/booking"
                className="mt-4 block text-center text-sm font-semibold text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--color-primary)" }}>
                BOOK APPOINTMENT
              </Link>
            </div>

            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
              <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Great Vibes', cursive", fontSize: "1.4rem" }}>Love Your Look?</h3>
              <p className="text-sm opacity-80 mb-3">Let us bring your beauty vision to life.</p>
              <ul className="space-y-1 text-xs opacity-80 mb-4">
                {["Premium Service", "Skilled Stylists", "Clean & Comfortable", "Walk-ins Welcome", "Appointments Recommended"].map(i => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span> {i}
                  </li>
                ))}
              </ul>
              <Link href="/booking"
                className="block text-center text-sm font-semibold py-3 rounded-lg border-2 border-white text-white hover:bg-white hover:text-[#8B1A1A] transition-all">
                BOOK YOUR APPOINTMENT
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div>
            <p className="text-gray-500 text-sm mb-1">Ready to look & feel your best?</p>
            <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Book your appointment today!</h3>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-primary)" }}>
              BOOK APPOINTMENT NOW →
            </Link>
            <a href={`tel:${BUSINESS.phone1Raw}`} className="font-bold text-sm" style={{ color: "var(--color-primary)" }}>
              📞 {BUSINESS.phone1}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
