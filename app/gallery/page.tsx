import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarCheck, Camera } from "lucide-react";
import { query } from "@/lib/db";
import { BUSINESS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our gallery of beautiful braids, twists, and weaves. Knotless braids, box braids, boho braids, passion twists, and more in Glen Burnie, MD.",
};

type ImgRow = { id: number; cloudinary_url: string; alt_text: string };

export default async function GalleryPage() {
  let imgs: ImgRow[] = [];
  try {
    imgs = await query<ImgRow>(
      `SELECT id, cloudinary_url, alt_text
       FROM images
       WHERE is_active = 1 AND cloudinary_url IS NOT NULL
       ORDER BY id ASC`
    );
  } catch {
    imgs = [];
  }

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center overflow-hidden" style={{ backgroundColor: "#FDF8F3", minHeight: "32vh" }}>
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center py-12">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-gold)" }}>
              Gallery
            </p>
            <h1
              className="text-4xl lg:text-5xl font-bold mb-2"
              style={{ fontFamily: "'Great Vibes', cursive", color: "var(--color-primary)" }}
            >
              Our Gallery.
            </h1>
            <p className="text-gray-500 text-sm mb-4 max-w-md leading-relaxed">
              Explore some of our beautiful work — {imgs.length}+ styles across braids, twists, locs, and more.
            </p>
          </div>
          <div className="hidden lg:block h-56 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/salon/salon-styling.jpg"
              alt="Solange's Hair Braiding Salon"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 42%" }}
            />
          </div>
        </div>
      </section>

      {/* Image grid */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {imgs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {imgs.map((img) => (
                <div key={img.id} className="aspect-[3/4] rounded-xl overflow-hidden relative group">
                  <Image
                    src={img.cloudinary_url}
                    alt={img.alt_text || "Coiffure réalisée au salon"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm">No photos yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-12 px-4" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-sm opacity-70 mb-1">Follow Our Work</p>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Follow Us for Inspo &amp; Updates!
          </h2>
          <p className="text-sm opacity-70 mb-4">
            New styles, behind-the-scenes, client transformations, specials &amp; more.
          </p>
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg border-2 border-white/50 text-white hover:bg-white hover:text-[#8B1A1A] transition-all"
          >
            <Camera size={16} /> {BUSINESS.instagram}
          </a>
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-10 px-4 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-gray-500 text-sm mb-2">Love Your Look?</p>
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Book Your Appointment Today!
          </h3>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <CalendarCheck size={16} />
            BOOK YOUR APPOINTMENT
          </Link>
        </div>
      </section>
    </>
  );
}
