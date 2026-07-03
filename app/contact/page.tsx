import { Metadata } from "next";
import { Phone, MapPin, Mail, Clock, MessageCircle } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { submitContactForm } from "./actions";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[38vh] flex items-center overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center py-16">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-gold)" }}>Contact Us</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-2" style={{ fontFamily: "'Great Vibes', cursive", color: "var(--color-primary)" }}>
              Contact Us
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              WE&apos;D LOVE TO HEAR FROM YOU!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Have a question, need more information, or want to book an appointment?<br />We&apos;re here to help!
            </p>
          </div>
          <div className="hidden lg:block h-56 rounded-2xl overflow-hidden shadow-xl">
            <img src="/images/salon/salon-interior.jpg" alt="Contact us" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: <Phone size={18} />, title: "Call Us",    info: [BUSINESS.phone1, BUSINESS.phone2], sub: "Walk-ins welcome",           href: `tel:${BUSINESS.phone1Raw}` },
            { icon: <MapPin size={18} />, title: "Visit Us",  info: [BUSINESS.address],                  sub: BUSINESS.addressLine2,           href: `https://maps.google.com/?q=${encodeURIComponent(BUSINESS.address)}` },
            { icon: <Clock size={18} />,  title: "Hours",     info: ["Mon–Sat: 8AM–7PM"],                sub: "Sunday: Closed" },
            { icon: <Mail size={18} />,   title: "Email Us",  info: [BUSINESS.email],                    sub: "We respond within 24h",         href: `mailto:${BUSINESS.email}` },
            { icon: <MessageCircle size={18} />, title: "WhatsApp", info: [BUSINESS.phone1],             sub: "Text us anytime!",              href: `https://wa.me/${BUSINESS.whatsapp}` },
          ].map((card, i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ backgroundColor: "#FDF8F3" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
                {card.icon}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">{card.title}</h3>
              {card.info.map((line, j) => <p key={j} className="text-xs text-gray-800 font-medium">{line}</p>)}
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map + Form */}
      <section className="py-12 px-4" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* Map */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Find Us</h3>
            <div className="h-64 rounded-2xl overflow-hidden shadow-md bg-gray-200 mb-4">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodeURIComponent(BUSINESS.address)}`}
                className="w-full h-full"
                allowFullScreen
                loading="lazy"
                title="Salon Location"
              />
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-bold text-sm text-gray-900 mb-3">Easy to Find. Easy to Love.</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                We are located in Crain Plaza, right off Ritchie Highway (MD-2) and minutes from I-695.
              </p>
              <div className="mt-3 flex gap-4 text-xs text-gray-500">
                <span>🚗 Free Parking Available on site</span>
                <span>📍 Great Location</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Send Us a Message</h3>

            {sent === "1" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h4 className="font-bold text-green-800 mb-2">Message Sent!</h4>
                <p className="text-sm text-green-700">Thank you! We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form action={submitContactForm} className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                {error === "1" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    Please fill in all required fields and check consent.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name *</label>
                    <input type="text" name="name" required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1A1A]"
                      placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number *</label>
                    <input type="tel" name="phone" required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1A1A]"
                      placeholder="Phone Number" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address *</label>
                  <input type="email" name="email" required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1A1A]"
                    placeholder="Email Address" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Service Interested In</label>
                  <select name="service"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1A1A]">
                    <option value="">Select a service...</option>
                    <option>Knotless Braids</option>
                    <option>Box Braids</option>
                    <option>Boho Braids</option>
                    <option>Passion Twist</option>
                    <option>Cornrows / Feed-In</option>
                    <option>Kids Braids</option>
                    <option>Locs Services</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">How can we help you? *</label>
                  <textarea name="message" required rows={4}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8B1A1A] resize-none"
                    placeholder="Your message..." />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="consent" name="consent" value="yes" className="mt-0.5" />
                  <label htmlFor="consent" className="text-xs text-gray-500">
                    I agree to be contacted regarding my inquiry.
                  </label>
                </div>
                <button type="submit"
                  className="w-full text-white text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--color-primary)" }}>
                  SEND MESSAGE →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Social follow */}
      <section className="py-10 px-4 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm opacity-70 mb-1">Stay Connected</p>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Follow Us for Inspo &amp; Updates!
          </h2>
          <p className="text-sm opacity-70 mb-4">New styles, behind-the-scenes, client transformations, specials &amp; more.</p>
          <p className="text-lg font-semibold">{BUSINESS.instagram}</p>
        </div>
      </section>
    </>
  );
}
