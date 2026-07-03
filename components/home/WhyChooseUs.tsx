import Image from "next/image";
import { Shield, Star, Clock, Heart } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const REASONS = [
  {
    icon: <Shield size={22} />,
    title: "Expert Stylists",
    desc: "Skilled professional stylists with years of experience delivering beautiful results.",
  },
  {
    icon: <Star size={22} />,
    title: "Premium Quality",
    desc: "We use top quality products and techniques to ensure long-lasting, beautiful results.",
  },
  {
    icon: <Clock size={22} />,
    title: "Clean & Comfortable",
    desc: "A relaxing, modern environment designed for your comfort and satisfaction.",
  },
  {
    icon: <Heart size={22} />,
    title: "Customer Care",
    desc: "Your satisfaction is our priority. We don't stop until you love your hair!",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: "#FDF8F3" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--color-gold)" }}>
              Why Choose Us
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              More Than a Style,
            </h2>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ fontFamily: "'Great Vibes', cursive", color: "var(--color-primary)" }}>
              It's an Experience
            </h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-md">
              At Solange's Hair Braiding LLC, we don't just braid hair, we build confidence. Every style is crafted with care,
              precision, and passion to make you look and feel absolutely amazing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REASONS.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {r.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-0.5">{r.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: salon image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 lg:h-96">
              <img
                src="/images/salon/salon-interior.jpg"
                alt="Solange's salon interior"
                className="w-full h-full object-cover"
              />
              {/* Overlay brand */}
              <div
                className="absolute bottom-0 right-0 m-4 px-4 py-3 rounded-xl text-white"
                style={{ backgroundColor: "rgba(139,26,26,0.92)" }}
              >
                <p className="text-sm font-script" style={{ fontFamily: "'Great Vibes', cursive" }}>Solange's</p>
                <p className="text-xs font-bold tracking-wider">HAIR BRAIDING</p>
                <p className="text-xs tracking-widest opacity-70">LLC</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
