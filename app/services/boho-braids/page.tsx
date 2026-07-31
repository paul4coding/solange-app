import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Boho Braids",
  description: "Beautiful boho braids in Glen Burnie, MD. Curly, bohemian protective style with a natural, carefree look. Starting at $200.",
};

export default function BohoBraidsPage() {
  return (
    <ServicePageTemplate
      slug="boho-braids"
      name="Boho Braids"
      category="Braids"
      tagline="Bohemian, Curly & Beautiful Protective Styles"
      description="Boho braids combine knotless or box braids with curly hair peeking out for a bohemian, carefree look. Perfect for festivals, vacations, and everyday glamour."
      startingPrice={200}
      duration="5–8 hours"
      hairIncluded
      benefits={[
        "Gorgeous curly texture",
        "Bohemian & romantic look",
        "Natural hair protection",
        "Perfect for all seasons",
        "Long-lasting style",
        "Unique & stylish",
        "Customizable curl pattern",
        "Great for all occasions",
      ]}
      variants={[
        { name: "Standard Boho Braids", description: "Knotless braids with synthetic curly hair peeking through — our most popular boho style.", price: "$200+" },
        { name: "Human Hair Boho", description: "Upgraded with 100% human hair curls for the most natural, premium boho look.", price: "$280+" },
        { name: "Luxury Boho Braids", description: "Full, lush boho braids with extra curly hair for maximum volume and impact.", price: "$250+" },
      ]}
      faqs={[
        { q: "How long do boho braids last?", a: "Boho braids typically last 4–6 weeks. The curly sections may need refreshing around week 3–4." },
        { q: "Can I get boho box braids instead of knotless?", a: "Yes! We can do boho braids in both knotless and box braid styles. Just let us know your preference when booking." },
        { q: "What type of curly hair is used?", a: "We use high-quality synthetic curly hair or human hair for the boho sections. Human hair options are available for an upgrade." },
        { q: "Can I get them wet?", a: "Yes, you can get your boho braids wet. However, the curly sections may shrink. We recommend drying them thoroughly after." },
      ]}
      aftercare={[
        "Use a curl refresher spray on the curly sections",
        "Sleep with a large satin bonnet to protect curls",
        "Avoid excessive manipulation of the curly sections",
        "Oil scalp regularly to maintain moisture",
        "Refresh curls with a diffuser if needed",
        "Remove after 6 weeks maximum",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
