import type { Metadata } from "next";
import Link from "next/link";
import { Award, BadgeCheck, Heart, Users2, Scissors, Sparkles, CalendarCheck, Check, Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { BUSINESS, TEAM } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Solange's Hair Braiding LLC - 15+ years of experience, expert stylists, and a passion for making you look and feel your best.",
};

const VALUES = [
  {
    icon: <Sparkles size={22} />,
    title: "Confidence",
    desc: "We help you look and feel your best with styles that bring out your natural beauty.",
  },
  {
    icon: <BadgeCheck size={22} />,
    title: "Quality",
    desc: "We use premium products and techniques to ensure long-lasting, healthy results.",
  },
  {
    icon: <Heart size={22} />,
    title: "Care",
    desc: "Your hair health is our priority. We treat every client with care and respect.",
  },
  {
    icon: <Users2 size={22} />,
    title: "Community",
    desc: "We love building real relationships and creating a positive, family-like environment.",
  },
];

const TEAM_COLORS = [
  { bg: "linear-gradient(135deg, #8B1A1A, #C9A96E)", text: "#fff" },
  { bg: "linear-gradient(135deg, #C9A96E, #8B1A1A)", text: "#fff" },
  { bg: "linear-gradient(135deg, #1A3A2A, #C9A96E)", text: "#fff" },
  { bg: "linear-gradient(135deg, #2A1A3A, #C9A96E)", text: "#fff" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
        {/* Decorative circle */}
        <div
          className="absolute right-0 top-0 w-[45%] h-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 50%, #C9A96E 0%, transparent 70%)" }}
        />
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--color-gold)" }}>
              About Us
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              OUR STORY,
              <br />
              <span style={{ color: "var(--color-primary)" }}>YOUR CONFIDENCE.</span>
            </h1>
            <p className="text-gray-600 text-sm mb-8 max-w-md leading-relaxed">
              At Solange's Hair Braiding LLC, we believe beauty is more than a style — it's a feeling.
              For over {BUSINESS.yearsExperience} years, we've helped our clients look amazing and feel
              confident with every braid, twist, and style.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <CalendarCheck size={16} />
              BOOK YOUR APPOINTMENT
            </Link>
          </div>

          {/* Stats cards on the right */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { value: `${BUSINESS.yearsExperience}+`, label: "Years of Experience", icon: <Award size={20} /> },
              { value: BUSINESS.happyClients, label: "Happy Clients", icon: <Users2 size={20} /> },
              { value: BUSINESS.totalStyles, label: "Braids & Styles Done", icon: <Scissors size={20} /> },
              { value: `${BUSINESS.rating}`, label: "Rated on Google", icon: <Star size={20} fill="currentColor" strokeWidth={0} /> },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {s.icon}
                </div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: "var(--color-primary)" }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 px-4 bg-white text-center border-y border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: "var(--color-gold)" }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--color-gold)" }}>
              Our Mission
            </span>
            <div className="h-px flex-1" style={{ background: "var(--color-gold)" }} />
          </div>
          <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
            "To{" "}
            <em style={{ color: "var(--color-primary)" }}>empower</em> every client through beautiful,
            protective styles in a welcoming and professional environment."
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Our Values" title="What We" titleHighlight="Stand For" />
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), #C9A96E)" }}
                >
                  {v.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 tracking-wide text-sm">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Our Team" title="The Professionals Behind Your" titleHighlight="Beauty" />
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((member, i) => {
              const color = TEAM_COLORS[i % TEAM_COLORS.length];
              const initials = member.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <div key={i} className="text-center group">
                  {/* Avatar with initials */}
                  <div className="relative w-32 h-32 mx-auto mb-5">
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
                      style={{ background: color.bg }}
                    >
                      <span
                        className="text-3xl font-bold select-none"
                        style={{ fontFamily: "'Playfair Display', serif", color: color.text }}
                      >
                        {initials}
                      </span>
                    </div>
                    {/* Gold ring */}
                    <div
                      className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity scale-110"
                      style={{ borderColor: "var(--color-gold)" }}
                    />
                  </div>

                  <h3
                    className="font-bold text-xl mb-0.5"
                    style={{ fontFamily: "'Great Vibes', cursive", color: "var(--color-primary)" }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                    {member.title}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{member.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 px-4 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: `${BUSINESS.yearsExperience}+`, label: "Years of Experience" },
            { value: BUSINESS.happyClients, label: "Happy Clients" },
            { value: BUSINESS.totalStyles, label: "Braids & Styles" },
            { value: `${BUSINESS.rating}`, label: "Rated on Google", icon: <Star size={18} fill="currentColor" strokeWidth={0} /> },
          ].map((s, i) => (
            <div key={i}>
              <div
                className="text-3xl font-bold mb-1 flex items-center justify-center gap-1.5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {s.value}
                {"icon" in s ? s.icon : null}
              </div>
              <div className="text-xs uppercase tracking-wider opacity-70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready for Your Next Look?
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Book your appointment today and let us bring out your best.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <CalendarCheck size={16} />
            BOOK APPOINTMENT NOW
          </Link>
          <p className="text-xs text-gray-400 mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1"><Check size={12} /> Walk-ins Welcome</span>
            <span className="inline-flex items-center gap-1"><Check size={12} /> Expert Stylists</span>
            <span className="inline-flex items-center gap-1"><Check size={12} /> Premium Products</span>
          </p>
        </div>
      </section>
    </>
  );
}
