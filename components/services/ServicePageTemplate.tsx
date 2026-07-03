import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Clock, DollarSign, ChevronRight, CheckCircle, Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { BUSINESS, REVIEWS } from "@/lib/constants";
import { query } from "@/lib/db";

interface ServiceVariant {
  name: string;
  description: string;
  price?: string;
}

interface ServicePageProps {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  startingPrice: number;
  duration: string;
  hairIncluded?: boolean;
  benefits: string[];
  variants?: ServiceVariant[];
  faqs?: { q: string; a: string }[];
  aftercare?: string[];
  seoTitle?: string;
  seoDesc?: string;
}

export default async function ServicePageTemplate({
  slug,
  name,
  category,
  tagline,
  description,
  startingPrice,
  duration,
  hairIncluded,
  benefits,
  variants,
  faqs,
  aftercare,
}: ServicePageProps) {
  type ImgRow = { id: number; cloudinary_url: string; alt_text: string | null; is_featured: number };
  type RelatedImgRow = { service_slug: string; cloudinary_url: string };

  // Fetch images for this service
  const images = await query<ImgRow>(
    `SELECT id, cloudinary_url, alt_text, is_featured FROM images
     WHERE service_slug = ? AND is_active = 1 AND cloudinary_url IS NOT NULL
     ORDER BY is_featured DESC LIMIT 12`,
    [slug]
  ).catch(() => [] as ImgRow[]);

  const heroImage = images[0]?.cloudinary_url || null;
  const galleryImages = images;

  // Fetch 1 featured image per related service
  const RELATED = [
    { name: "Box Braids", slug: "box-braids", price: 150 },
    { name: "Boho Braids", slug: "boho-braids", price: 200 },
    { name: "Passion Twist", slug: "passion-twist", price: 190 },
    { name: "Knotless Braids", slug: "knotless-braids", price: 180 },
    { name: "Feed-In Braids", slug: "feed-in-braids", price: 60 },
    { name: "Fulani Braids", slug: "fulani-braids", price: 180 },
  ].filter(s => s.slug !== slug);

  const relatedSlugs = RELATED.slice(0, 4).map(s => s.slug);
  const relatedPlaceholders = relatedSlugs.map(() => "?").join(",");
  const relatedImgs = await query<RelatedImgRow>(
    `SELECT service_slug, cloudinary_url FROM images
     WHERE service_slug IN (${relatedPlaceholders}) AND is_active = 1
       AND cloudinary_url IS NOT NULL
     ORDER BY is_featured DESC LIMIT 20`,
    relatedSlugs
  ).catch(() => [] as RelatedImgRow[]);

  // 1 image per related service
  const relatedImgMap = new Map<string, string>();
  for (const img of relatedImgs) {
    if (!relatedImgMap.has(img.service_slug)) {
      relatedImgMap.set(img.service_slug, img.cloudinary_url!);
    }
  }

  const relatedServices = RELATED.slice(0, 4).map(s => ({
    ...s,
    image: relatedImgMap.get(s.slug) || null,
  }));

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight size={12} />
          <Link href="/services" className="hover:text-gray-600">Services</Link>
          <ChevronRight size={12} />
          <span style={{ color: "var(--color-primary)" }}>{name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative min-h-[52vh] flex items-center overflow-hidden" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle at 70% 50%, #C9A96E, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center py-16">
          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--color-gold)" }}>
              {category}
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: "var(--color-primary)" }}>
              {name.toUpperCase()}
            </h1>
            <p className="text-base font-medium text-gray-600 mb-4 uppercase tracking-wide">{tagline}</p>
            <p className="text-gray-500 text-sm mb-6 max-w-md leading-relaxed">{description}</p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign size={16} style={{ color: "var(--color-gold)" }} />
                <span className="font-bold text-gray-900">Starting at <span style={{ color: "var(--color-primary)" }}>${startingPrice}+</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} style={{ color: "var(--color-gold)" }} />
                <span className="text-gray-600">{duration}</span>
              </div>
              {hairIncluded && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} style={{ color: "var(--color-gold)" }} />
                  <span className="text-gray-600">Hair Included Option</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/booking"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--color-primary)" }}>
                <CalendarCheck size={16} /> BOOK APPOINTMENT
              </Link>
              <Link href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
                VIEW GALLERY →
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:flex justify-center">
            <div className="w-80 h-96 rounded-3xl overflow-hidden shadow-2xl relative"
              style={{ background: "linear-gradient(135deg, #FDF8F3, #C9A96E22)" }}>
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={`${name} at Solange's Hair Braiding`}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF8F3, #C9A96E33)" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.5">
                    <path d="M12 2C9.5 2 7 4 7 7c0 2.5 1.5 4.5 3.5 5.5C8 13.5 6 15.5 6 18v2h12v-2c0-2.5-2-4.5-4.5-5.5C15.5 11.5 17 9.5 17 7c0-3-2.5-5-5-5z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="py-14 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="Why Choose This Style" title={`Benefits of ${name}`} />
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: "#FDF8F3" }}>
                  <CheckCircle size={16} className="shrink-0 mt-0.5" style={{ color: "var(--color-gold)" }} />
                  <span className="text-sm text-gray-700">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Variants / Pricing */}
      {variants && variants.length > 0 && (
        <section className="py-14 px-4" style={{ backgroundColor: "#FDF8F3" }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader label="Options" title="Choose Your" titleHighlight="Style" />
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {variants.map((v, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{v.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{v.description}</p>
                  {v.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>{v.price}</span>
                      <Link href="/booking" className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: "var(--color-primary)" }}>
                        Book Now
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Featured Gallery" title="Our" titleHighlight={name} />
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {galleryImages.length > 0 ? galleryImages.map((img, i) => (
              <div key={img.id || i} className="aspect-[3/4] rounded-xl overflow-hidden relative group">
                <Image
                  src={img.cloudinary_url!}
                  alt={img.alt_text || `${name} style ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
              </div>
            )) : (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-amber-50 to-red-50 animate-pulse" />
              ))
            )}
          </div>
          <div className="mt-6 text-center">
            <Link href="/gallery" className="text-sm font-semibold hover:underline" style={{ color: "var(--color-primary)" }}>
              VIEW FULL GALLERY →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="py-14 px-4" style={{ backgroundColor: "#FDF8F3" }}>
          <div className="max-w-4xl mx-auto">
            <SectionHeader label="Questions & Answers" title="Frequently Asked" titleHighlight="Questions" />
            <div className="mt-8 space-y-3">
              {faqs.map((faq, i) => (
                <details key={i} className="bg-white rounded-xl p-5 shadow-sm group">
                  <summary className="font-semibold text-sm text-gray-800 cursor-pointer flex items-center justify-between">
                    {faq.q}
                    <span className="text-[#8B1A1A] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-sm text-gray-500 mt-3 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Aftercare */}
      {aftercare && aftercare.length > 0 && (
        <section className="py-14 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <SectionHeader label="Maintenance Tips" title={`${name} Aftercare`} />
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {aftercare.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100">
                  <span className="font-bold text-sm min-w-5 min-h-5 w-5 h-5 rounded-full text-white flex items-center justify-center text-xs"
                    style={{ backgroundColor: "var(--color-gold)" }}>{i + 1}</span>
                  <p className="text-sm text-gray-600">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-14 px-4" style={{ backgroundColor: "#FDF8F3" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader label="Client Reviews" title="What Clients Say" />
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 italic mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: "var(--color-primary)" }}>{r.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-white" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm opacity-70 mb-1">Ready for Your Next Braided Look?</p>
          <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Book your appointment today and experience premium braiding services at Solange Hair Braiding LLC.
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/booking"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg border-2 border-white text-white hover:bg-white hover:text-[#8B1A1A] transition-all">
              <CalendarCheck size={15} /> BOOK APPOINTMENT
            </Link>
            <a href={`tel:${BUSINESS.phone1Raw}`}
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              📞 {BUSINESS.phone1}
            </a>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-bold text-center text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}
                className="rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all group">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-amber-50 to-red-50 overflow-hidden">
                  {s.image ? (
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDF8F3, #C9A96E22)" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" opacity="0.6">
                        <path d="M12 2C9.5 2 7 4 7 7c0 2.5 1.5 4.5 3.5 5.5C8 13.5 6 15.5 6 18v2h12v-2c0-2.5-2-4.5-4.5-5.5C15.5 11.5 17 9.5 17 7c0-3-2.5-5-5-5z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-bold text-gray-800 mb-0.5">{s.name}</p>
                  <p className="text-xs font-bold" style={{ color: "var(--color-primary)" }}>From ${s.price}+</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
