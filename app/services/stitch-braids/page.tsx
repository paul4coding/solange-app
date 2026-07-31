import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Stitch Braids",
  description: "Stitch braids in Glen Burnie, MD. Sharp, defined cornrow lines with a unique stitch pattern. Starting at $80.",
};

export default function StitchBraidsPage() {
  return (
    <ServicePageTemplate
      slug="stitch-braids"
      name="Stitch Braids"
      category="Cornrows"
      tagline="Sharp Lines & Defined Stitch Patterns"
      description="Stitch braids feature a unique stitch pattern created by lifting sections of hair as the braid is formed, creating sharp, defined lines and a clean, polished look."
      startingPrice={80}
      duration="2–4 hours"
      hairIncluded
      benefits={[
        "Sharp defined stitch lines",
        "Clean & polished look",
        "Great for men & women",
        "Unique pattern design",
        "Low-tension style",
        "Professional appearance",
        "Long-lasting hold",
        "Great for natural hair",
      ]}
      variants={[
        { name: "Classic Stitch Braids", description: "Traditional stitch braid pattern straight back.", price: "$80+" },
        { name: "Curved Stitch Braids", description: "Curved or arched stitch braids for a more dynamic look.", price: "$100+" },
        { name: "Geometric Stitch Design", description: "Creative geometric patterns with the stitch technique.", price: "$120+" },
      ]}
      faqs={[
        { q: "What makes stitch braids different from regular cornrows?", a: "Stitch braids have a distinctive 'stitch' pattern created by lifting sections of hair as the braid is formed, giving sharper and more defined lines." },
        { q: "How long do stitch braids last?", a: "Stitch braids typically last 2–4 weeks with proper maintenance." },
        { q: "Are stitch braids good for men?", a: "Absolutely! Stitch braids are very popular among men for their clean, sharp lines and professional appearance." },
      ]}
      aftercare={[
        "Use edge control to keep lines sharp",
        "Oil scalp daily to maintain moisture",
        "Sleep with a durag or satin scarf",
        "Avoid excessive moisture or sweating",
        "Remove after 3–4 weeks to prevent matting",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
