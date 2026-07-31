import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Senegalese Twist",
  description: "Senegalese twist in Glen Burnie, MD. Sleek, twisted & lightweight protective style. Starting at $180. Long-lasting and natural-looking.",
};

export default function SenegaleseTwistPage() {
  return (
    <ServicePageTemplate
      slug="senegalese-twist"
      name="Senegalese Twist"
      category="Twists"
      tagline="Sleek, Twisted & Lightweight Protective Style"
      description="Senegalese twists are a sleek, rope-like twist style created with Kanekalon or Remy hair. They're smooth, shiny, and lay flat — creating an elegant and sophisticated look."
      startingPrice={180}
      duration="4–7 hours"
      hairIncluded
      benefits={[
        "Sleek & elegant look",
        "Lightweight & comfortable",
        "Lasts 6–8 weeks",
        "Low maintenance",
        "Less frizz than other twists",
        "Versatile styling",
        "Great for all hair types",
        "Smooth, shiny texture",
      ]}
      variants={[
        { name: "Small Senegalese Twist", description: "Thin, delicate twists for a more detailed and voluminous look.", price: "$200+" },
        { name: "Medium Senegalese Twist", description: "The most popular size — balanced and beautiful.", price: "$180+" },
        { name: "Large Senegalese Twist", description: "Bold, chunky twists that make a statement.", price: "$160+" },
      ]}
      faqs={[
        { q: "How long do Senegalese twists last?", a: "With proper care, Senegalese twists last 6–8 weeks." },
        { q: "What hair is used for Senegalese twists?", a: "We use Kanekalon or Remy hair for Senegalese twists. Both create a smooth, sleek texture." },
        { q: "Can I get Senegalese twists in different colors?", a: "Yes! We can create ombre, highlighted, or single-color Senegalese twists." },
        { q: "Are they heavy?", a: "No! Senegalese twists are actually one of the lighter protective styles due to the smooth, flat texture of the hair used." },
      ]}
      aftercare={[
        "Moisturize twists with a light oil or spray",
        "Sleep with a satin bonnet nightly",
        "Avoid excessive manipulation",
        "Wash gently with diluted shampoo every 2–3 weeks",
        "Avoid heavy products that cause buildup on twists",
        "Remove after 8 weeks maximum",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
