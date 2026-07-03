import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { query } from "@/lib/db";

type ImgRow = { id: number; service_slug: string; cloudinary_url: string; alt_text: string | null };

export default async function HomeGallery() {
  const images = await query<ImgRow>(
    `SELECT id, service_slug, cloudinary_url, alt_text FROM images
     WHERE is_active = 1 AND cloudinary_url IS NOT NULL
     ORDER BY is_featured DESC LIMIT 30`
  ).catch(() => [] as ImgRow[]);

  // 1 image par service, max 6 pour la homepage
  const seen = new Set<string>();
  const gallery = images.filter(img => {
    if (seen.has(img.service_slug)) return false;
    seen.add(img.service_slug);
    return true;
  }).slice(0, 6);

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
              href={`/services/${img.service_slug}`}
              className="aspect-[3/4] rounded-xl overflow-hidden relative group cursor-pointer block"
            >
              <Image
                src={img.cloudinary_url!}
                alt={img.alt_text || img.service_slug}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <span className="text-white text-xs font-semibold capitalize">
                  {img.service_slug.replace(/-/g, " ")}
                </span>
              </div>
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
