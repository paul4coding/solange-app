import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scissors, Sparkles, Star, Crown, Users, Flower2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { SERVICES } from "@/lib/constants";
import { query } from "@/lib/db";

const featured = SERVICES.filter((s) => s.featured);

const FALLBACK_ICONS: Record<string, React.ReactNode> = {
  "knotless-braids": <Scissors size={28} strokeWidth={1.5} />,
  "box-braids": <Scissors size={28} strokeWidth={1.5} />,
  "boho-braids": <Flower2 size={28} strokeWidth={1.5} />,
  "passion-twist": <Sparkles size={28} strokeWidth={1.5} />,
  "feed-in-braids": <Crown size={28} strokeWidth={1.5} />,
  "stitch-braids": <Star size={28} strokeWidth={1.5} />,
  "senegalese-twist": <Sparkles size={28} strokeWidth={1.5} />,
  "kids-braids": <Users size={28} strokeWidth={1.5} />,
  "starter-locs": <Flower2 size={28} strokeWidth={1.5} />,
  "loc-retwist": <Star size={28} strokeWidth={1.5} />,
  "frontal-install": <Crown size={28} strokeWidth={1.5} />,
  "fulani-braids": <Scissors size={28} strokeWidth={1.5} />,
};

type ImgRow = { service_slug: string; cloudinary_url: string };

export default async function SignatureServices() {
  const slugs = featured.map((s) => s.slug);
  const placeholders = slugs.map(() => "?").join(",");
  const images = await query<ImgRow>(
    `SELECT service_slug, cloudinary_url FROM images
     WHERE is_active = 1 AND is_featured = 1 AND cloudinary_url IS NOT NULL
       AND service_slug IN (${placeholders})`,
    slugs
  ).catch(() => [] as ImgRow[]);

  const imageMap: Record<string, string> = {};
  images.forEach((img) => {
    if (!imageMap[img.service_slug]) {
      imageMap[img.service_slug] = img.cloudinary_url;
    }
  });

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Our Signature Services"
          title="Styles That"
          titleHighlight="Empower You"
        />

        {/* Mobile: scroll horizontal, Desktop: grille */}
        <div className="mt-10 flex sm:grid gap-4 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scroll-smooth snap-x snap-mandatory sm:snap-none sm:grid-cols-4 lg:grid-cols-7 -mx-4 px-4 sm:mx-0 sm:px-0">
          {featured.map((service) => {
            const photo = imageMap[service.slug] || null;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col items-center text-center gap-2 p-3 rounded-xl hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex-shrink-0 w-28 sm:w-auto snap-start"
              >
                <div
                  className="w-20 h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C9A96E] transition-colors relative"
                  style={{ background: "linear-gradient(135deg, #FDF8F3, #C9A96E22)" }}
                >
                  {photo ? (
                    <Image
                      src={photo}
                      alt={service.name}
                      fill
                      className="object-cover object-top"
                      sizes="80px"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {FALLBACK_ICONS[service.slug] ?? <Scissors size={28} strokeWidth={1.5} />}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide leading-tight">
                  {service.name}
                </span>
                <span className="text-xs text-[#8B1A1A] font-semibold">
                  From ${service.startingPrice}+
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8B1A1A] hover:gap-3 transition-all"
          >
            VIEW ALL SERVICES <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
