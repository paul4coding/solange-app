"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const CATEGORY_MAP: Record<string, string[]> = {
  "All Styles": [],
  "Knotless Braids": ["knotless-braids"],
  "Box Braids": ["box-braids"],
  "Boho Braids": ["boho-braids"],
  "Twists": ["passion-twist", "senegalese-twist"],
  "Cornrows": ["feed-in-braids", "stitch-braids"],
  "Loc Styles": ["starter-locs", "loc-retwist"],
  "Kids Styles": ["kids-braids"],
  "Fulani & Tribal": ["fulani-braids"],
  "Weaves": ["frontal-install"],
};

const FILTERS = Object.keys(CATEGORY_MAP);

interface GalleryImage {
  id: string;
  service_slug: string;
  cloudinary_url: string;
  alt_text: string | null;
}

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState("All Styles");

  const filtered = active === "All Styles"
    ? images
    : images.filter(img => CATEGORY_MAP[active]?.includes(img.service_slug));

  return (
    <>
      {/* Filter tabs */}
      <section className="py-6 px-4 bg-white border-b border-gray-100 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all"
              style={{
                backgroundColor: active === f ? "var(--color-primary)" : "transparent",
                color: active === f ? "white" : "#6B7280",
                border: `1.5px solid ${active === f ? "var(--color-primary)" : "#E5E7EB"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((img) => (
                <div key={img.id}
                  className="aspect-[3/4] rounded-xl overflow-hidden relative group cursor-pointer">
                  <Image
                    src={img.cloudinary_url}
                    alt={img.alt_text || img.service_slug}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-semibold capitalize">
                      {img.service_slug.replace(/-/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-sm">No images for this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-12 px-4" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-sm opacity-70 mb-1">Follow Our Work</p>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Great Vibes', cursive" }}>
            Follow Us for Inspo & Updates!
          </h2>
          <p className="text-sm opacity-70 mb-4">New styles, behind-the-scenes, client transformations, specials & more.</p>
          <a href={BUSINESS.instagramUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg border-2 border-white/50 text-white hover:bg-white hover:text-[#8B1A1A] transition-all">
            📸 {BUSINESS.instagram}
          </a>
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-10 px-4 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <p className="text-gray-500 text-sm mb-2">Love Your Look?</p>
          <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Book Your Appointment Today!</h3>
          <Link href="/booking"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-primary)" }}>
            <CalendarCheck size={16} /> BOOK YOUR APPOINTMENT
          </Link>
        </div>
      </section>
    </>
  );
}
