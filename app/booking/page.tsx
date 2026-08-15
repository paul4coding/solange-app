import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { BUSINESS, TEAM } from "@/lib/constants";
import { getBusiness } from "@/lib/settings";
import { submitBooking } from "./actions";

export const metadata: Metadata = { title: "Book an Appointment" };

const TIMES = [
  "8:00 AM","9:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM",
];

const today = new Date().toISOString().split("T")[0];

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  // Coordonnées modifiables depuis l'admin ; BUSINESS garde le montant de l'acompte.
  const contact = await getBusiness();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F3" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--color-gold)" }}>
            Solange&apos;s Hair Braiding
          </p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Book Your Appointment
          </h1>
          <p className="text-sm text-gray-400 mt-1">Fill in the form below — we will confirm by phone.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form action={submitBooking} className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 space-y-6">

          {error === "1" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              Please fill in all required fields.
            </div>
          )}

          {/* Style souhaité — champ libre */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
              What style would you like? *
            </label>
            <textarea name="serviceName" required rows={3}
              placeholder="Tell us the style you have in mind — braids, twists, locs, a length, a colour, or a photo you saw. We will confirm the price with you."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:border-[#8B1A1A] transition-colors resize-y" />
            <p className="text-xs text-gray-400 mt-1.5">
              Not sure what it is called? Just describe it — we will help you choose.
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
              Date *
            </label>
            <input type="date" name="date" required min={today}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A] transition-colors" />
          </div>

          {/* Time */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-2">
              Preferred Time *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIMES.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input type="radio" name="time" value={t} required className="sr-only peer" />
                  <span className="block text-center py-2.5 rounded-xl text-xs font-semibold border-2 border-gray-200 text-gray-600 peer-checked:border-[#8B1A1A] peer-checked:bg-[#8B1A1A] peer-checked:text-white transition-all cursor-pointer select-none">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Personal info */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Your Information</p>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Full Name *</label>
              <input type="text" name="name" required placeholder="Your name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Phone *</label>
              <input type="tel" name="phone" required placeholder="(xxx) xxx-xxxx"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Email *</label>
              <input type="email" name="email" required placeholder="your@email.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Preferred Stylist (optional)</label>
              <select name="stylist"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A]">
                <option value="">No preference</option>
                {TEAM.map((t) => <option key={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Notes (length, color, style…)</label>
              <textarea name="notes" rows={3} placeholder="Tell us what you have in mind…"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8B1A1A] resize-none" />
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
            <p className="font-bold mb-1">Good to know:</p>
            <p>• A ${BUSINESS.deposit} deposit will be required to confirm your appointment</p>
            <p>• Arrive 10–15 min early with clean, detangled hair</p>
            <p>• Cancellations: 24h notice minimum</p>
          </div>

          <button type="submit"
            className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}>
            CONFIRM APPOINTMENT <ArrowRight size={15} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Call us at{" "}
          <a href={`tel:${contact.phone1Raw}`} className="font-semibold text-gray-600">{contact.phone1}</a>
          {" "}or{" "}
          <a href={`tel:${contact.phone2Raw}`} className="font-semibold text-gray-600">{contact.phone2}</a>
        </p>
      </div>
    </div>
  );
}
