import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Fulani Braids",
  description: "Traditional Fulani braids in Glen Burnie, MD. African-inspired braids with beads and accessories. Starting at $180.",
};

export default function FulaniBraidsPage() {
  return (
    <ServicePageTemplate
      slug="fulani-braids"
      name="Fulani Braids"
      category="Braids"
      tagline="Traditional African-Inspired Braiding with Modern Elegance"
      description="Fulani braids are a traditional West African braiding style featuring a central cornrow, side braids, and often decorated with beads and accessories. A beautiful fusion of culture and style."
      startingPrice={180}
      duration="4–6 hours"
      hairIncluded
      benefits={[
        "Culturally rich style",
        "Unique bead decorations",
        "Versatile design options",
        "Great protective style",
        "Stands out elegantly",
        "Works for all occasions",
        "Natural hair protection",
        "Long-lasting look",
      ]}
      variants={[
        { name: "Traditional Fulani", description: "Classic Fulani style with central cornrow, side braids, and traditional beads.", price: "$180+" },
        { name: "Modern Fulani", description: "Contemporary interpretation with mixed braid sizes and modern accessories.", price: "$200+" },
        { name: "Beaded Fulani Braids", description: "Full Fulani style with an abundance of beads, shells, and decorative accessories.", price: "$220+" },
      ]}
      faqs={[
        { q: "What are Fulani braids?", a: "Fulani braids are a West African braiding style that traditionally features a central braid running from front to back, braids on the sides, and decorative beads or accessories." },
        { q: "Can I provide my own beads?", a: "Absolutely! You can bring your own beads or let us provide them. We carry a variety of beads and accessories." },
        { q: "How long do Fulani braids last?", a: "Fulani braids typically last 4–6 weeks with proper care." },
        { q: "Can I customize the design?", a: "Yes! Fulani braids are highly customizable. We can adjust the braid pattern, size, and accessories to fit your style." },
      ]}
      aftercare={[
        "Be gentle with accessories and beads to avoid breakage",
        "Oil scalp and braids regularly",
        "Sleep with a satin bonnet or scarf",
        "Keep braids clean with diluted shampoo",
        "Avoid excessive tension on braid roots",
        "Remove after 6 weeks",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
