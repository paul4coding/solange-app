import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Knotless Braids",
  description: "Professional knotless braids in Glen Burnie, MD. Lightweight, natural-looking protective style. Starting at $180. Book your appointment today!",
  keywords: ["knotless braids glen burnie", "knotless braids maryland", "protective style md"],
};

export default function KnotlessBraidsPage() {
  return (
    <ServicePageTemplate
      slug="knotless-braids"
      name="Knotless Braids"
      category="Braids"
      tagline="Premium Knotless Braiding Services"
      description="Knotless braids are a modern, tension-free braiding technique that starts with your natural hair before adding extensions — creating a lightweight, natural look with less scalp stress."
      startingPrice={180}
      duration="4–6 hours"
      hairIncluded
      benefits={[
        "Less tension on scalp",
        "No knot at root — natural start",
        "Lightweight & comfortable",
        "Lasts 6–8 weeks",
        "Less breakage at roots",
        "Versatile styling options",
        "Works on all hair types",
        "Beginner-friendly style",
      ]}
      variants={[
        { name: "Small Knotless Braids", description: "Thin, delicate braids for a detailed, intricate look. Best for length and versatility.", price: "$200+" },
        { name: "Medium Knotless Braids", description: "Our most popular size — perfect balance of size, time, and longevity.", price: "$180+" },
        { name: "Large / Jumbo Knotless", description: "Bigger, bolder braids that are quicker to install and make a statement.", price: "$160+" },
      ]}
      faqs={[
        { q: "How long do knotless braids last?", a: "With proper care, knotless braids last 6–8 weeks. We recommend a touch-up or removal around the 8-week mark." },
        { q: "Is hair included?", a: "Yes! We can provide hair for an additional fee. We use quality X-Pression braiding hair. You're also welcome to bring your own." },
        { q: "How long does the appointment take?", a: "Knotless braids take 4–6 hours depending on size and length chosen." },
        { q: "Do I need a deposit?", a: "Yes, a $30 non-refundable deposit is required to secure your appointment. It applies to your total service cost." },
        { q: "Can I wash my knotless braids?", a: "Yes! Wash every 2–3 weeks with diluted shampoo, focusing on the scalp. Let them air dry completely." },
      ]}
      aftercare={[
        "Moisturize your scalp daily with a light oil or braids spray",
        "Wrap hair in a satin scarf or bonnet at night",
        "Avoid excessive pulling or tight ponytails",
        "Wash every 2–3 weeks with diluted shampoo",
        "Let braids air dry completely — avoid sleeping wet",
        "Do not leave in longer than 8 weeks",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
