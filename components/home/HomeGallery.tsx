import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { query } from "@/lib/db";

type ImgRow = { id: number; cloudinary_url: string; alt_text: string | null };

export default async function HomeGallery() {
  // Plus de catégories : simple aperçu des 6 premières photos du catalogue.
  const gallery = await query<ImgRow>(
    `SELECT id, cloudinary_url, alt_text FROM images
     WHERE is_active = 1 AND cloudinary_url IS NOT NULL
     ORDER BY is_featured DESC, id ASC LIMIT 6`
  ).catch(() => [] as ImgRow[]);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Our Work"
          title="Beauty in"
          titleHighlight="Every Braid"
          subtitle="Each style is done with precision, care, and passion."
        />

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gallery.length > 0 ? gallery.map((img) => (
            <Link
              key={img.id}
              href="/gallery"
              className="aspect-[3/4] rounded-xl overflow-hidden relative group cursor-pointer block"
            >
              <Image
                src={img.cloudinary_url!}
                alt={img.alt_text || "Coiffure réalisée au salon"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            </Link>
          )) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-amber-50 to-red-50 animate-pulse" />
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            VIEW FULL GALLERY
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
