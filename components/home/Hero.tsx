import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, Images, Award } from "lucide-react";
import { BUSINESS } from "@/lib/constants";
import { query } from "@/lib/db";

export default async function Hero() {
  const heroImages = await query<{ cloudinary_url: string; alt_text: string }>(
    `SELECT cloudinary_url, alt_text FROM images
     WHERE service_slug IN ('knotless-braids','box-braids','boho-braids')
       AND is_featured = 1 AND cloudinary_url IS NOT NULL AND is_active = 1
     ORDER BY is_featured DESC LIMIT 1`
  ).catch(() => []);

  const braidingImage = heroImages[0]?.cloudinary_url || null;

  return (
    <section className="relative overflow-hidden bg-[#FDF8F3]" style={{ isolation: "isolate" }}>

      {/* ══════════════════════════════════
          MOBILE — layout dédié
      ══════════════════════════════════ */}
      <div className="lg:hidden relative flex flex-col" style={{ minHeight: "92vh" }}>

        {/* Image en fond (femme avec tresses) */}
        {braidingImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={braidingImage}
              alt="Beautiful braids"
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
            {/* Gradient : crème en haut (texte), transparent en bas (image visible) */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, #FDF8F3 0%, #FDF8F3 40%, rgba(253,248,243,0.7) 60%, rgba(253,248,243,0.0) 100%)",
              }}
            />
          </div>
        )}

        {/* Texte en haut */}
        <div className="relative z-10 px-5 pt-8 pb-4">
          {/* Tag */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-6 flex-shrink-0" style={{ background: "var(--color-gold)" }} />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: "var(--color-gold)" }}>
              Braids • Beauty • Confidence
            </span>
          </div>

          {/* Titres */}
          <h1
            className="text-[2.6rem] font-black leading-[1.0] mb-1.5 uppercase"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1A1A" }}
          >
            Beautiful<br />
            <span className="italic" style={{ color: "var(--color-primary)" }}>Braids.</span>
          </h1>
          <h1
            className="text-[2rem] font-black leading-[1.0] mb-1.5 uppercase"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1A1A" }}
          >
            Timeless<br />
            <span className="italic" style={{ color: "var(--color-gold)" }}>Style.</span>
          </h1>
          <h2
            className="text-2xl font-bold mb-4 uppercase"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--color-primary)" }}
          >
            Confident You.
          </h2>

          <p className="text-gray-600 text-sm mb-5 leading-relaxed max-w-xs">
            Specialize in all braids, twists &amp; weaves.<br />
            Designed to bring out your best.
          </p>

          {/* Boutons */}
          <div className="flex flex-col gap-2.5 mb-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 text-white text-sm font-bold px-5 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg w-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <CalendarCheck size={16} />
              BOOK YOUR APPOINTMENT
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 text-sm font-bold px-5 py-3.5 rounded-xl border-2 hover:bg-white/50 transition-colors w-full"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              <Images size={16} />
              VIEW GALLERY
            </Link>
          </div>

          <p className="text-xs text-gray-400 italic">
            Walk-Ins Welcome · Appointments Recommended
          </p>
        </div>

        {/* Badge expérience — en bas à droite */}
        <div className="relative z-10 flex justify-end px-5 pb-6 mt-auto">
          <div
            className="flex flex-col items-center justify-center shadow-xl text-white"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "var(--color-primary)",
              border: "3px solid white",
            }}
          >
            <Award size={14} className="mb-0.5 opacity-90" />
            <span className="text-base font-black leading-none">{BUSINESS.yearsExperience}+</span>
            <span className="text-[7px] text-center leading-tight opacity-80 font-semibold px-1">
              YEARS OF<br />EXP.
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          DESKTOP — layout 2 colonnes
      ══════════════════════════════════ */}
      <div className="hidden lg:block">
        {/* Cercles décoratifs fond */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.06]"
            style={{ background: "var(--color-gold)" }}
          />
          <div
            className="absolute -bottom-40 right-1/3 w-[500px] h-[500px] rounded-full border-2 opacity-[0.08]"
            style={{ borderColor: "var(--color-gold)" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-12 w-full grid lg:grid-cols-[1fr_1.1fr] gap-20 items-center py-16 min-h-screen">

          {/* Texte */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 flex-shrink-0" style={{ background: "var(--color-gold)" }} />
              <span className="text-[11px] tracking-[0.22em] uppercase font-bold" style={{ color: "var(--color-gold)" }}>
                Braids • Beauty • Confidence
              </span>
            </div>

            <h1
              className="text-6xl xl:text-7xl font-black leading-[1.0] mb-2 uppercase"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1A1A1A" }}
            >
              Beautiful<br />
              <span className="italic" style={{ color: "var(--color-primary)" }}>Braids.</span>
            </h1>
            <h1
              className="text-5xl xl:text-6xl font-black leading-[1.0] mb-2 uppercase"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1A1A1A" }}
            >
              Timeless<br />
              <span className="italic" style={{ color: "var(--color-gold)" }}>Style.</span>
            </h1>
            <h2
              className="text-3xl xl:text-4xl font-bold mb-7 uppercase"
              style={{ fontFamily: "'Playfair Display', serif", color: "var(--color-primary)" }}
            >
              Confident You.
            </h2>

            <p className="text-gray-500 text-[15px] max-w-sm mb-9 leading-relaxed">
              Specialize in all braids, twists &amp; weaves.<br />
              Designed to bring out your best.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <CalendarCheck size={16} />
                BOOK YOUR APPOINTMENT
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
              >
                <Images size={16} />
                VIEW GALLERY
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-px flex-shrink-0" style={{ backgroundColor: "var(--color-gold)" }} />
              <p className="text-sm text-gray-400 italic">
                Walk-Ins Welcome · Appointments Recommended
              </p>
            </div>
          </div>

          {/* Collage 2 images */}
          <div className="relative flex justify-end">
            <div className="relative w-full max-w-[520px]" style={{ height: "600px" }}>

              {braidingImage && (
                <div
                  className="absolute top-0 right-0 rounded-[2rem] overflow-hidden shadow-2xl"
                  style={{ width: "62%", height: "100%", border: "4px solid white" }}
                >
                  <Image
                    src={braidingImage}
                    alt="Beautiful braids"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="320px"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
                  />
                </div>
              )}

              <div
                className="absolute overflow-hidden shadow-xl"
                style={{
                  bottom: "30px", left: "0",
                  width: "55%", height: "58%",
                  borderRadius: "1.5rem",
                  border: "4px solid white",
                  outline: "2px solid rgba(201,169,110,0.5)",
                  outlineOffset: "4px",
                }}
              >
                <Image
                  src="/images/salon/salon-reception.jpg"
                  alt="Solange's Hair Braiding Salon"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 45%" }}
                  priority
                  sizes="280px"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }}
                >
                  <p className="text-white text-xs font-bold tracking-wide">Solange&apos;s Studio</p>
                  <p className="text-white/70 text-[10px]">Glen Burnie, Maryland</p>
                </div>
              </div>

              <div
                className="absolute z-20 flex flex-col items-center justify-center shadow-2xl text-white"
                style={{
                  top: "14px", left: "34%",
                  width: "80px", height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-primary)",
                  border: "3px solid white",
                }}
              >
                <Award size={16} className="mb-0.5 opacity-90" />
                <span className="text-lg font-black leading-none">{BUSINESS.yearsExperience}+</span>
                <span className="text-[8px] text-center leading-tight opacity-80 font-semibold px-1">
                  YEARS OF<br />EXPERIENCE
                </span>
              </div>

              <div
                className="absolute top-12 bottom-12 pointer-events-none"
                style={{
                  left: "calc(45% - 2px)", width: "2px",
                  background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.6) 30%, rgba(201,169,110,0.6) 70%, transparent)",
                }}
              />
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full border-2 opacity-25 pointer-events-none"
                style={{ borderColor: "var(--color-gold)" }}
              />
              <div
                className="absolute -bottom-4 right-8 w-8 h-8 rounded-full opacity-40 pointer-events-none"
                style={{ backgroundColor: "var(--color-gold)" }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
