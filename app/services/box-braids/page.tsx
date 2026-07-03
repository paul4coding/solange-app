import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Box Braids",
  description: "Classic box braids in Glen Burnie, MD. Small, medium & jumbo sizes available. Starting at $150. Protective style that lasts 6–8 weeks.",
};

export default function BoxBraidsPage() {
  return (
    <ServicePageTemplate
      slug="box-braids"
      name="Box Braids"
      category="Braids"
      tagline="Classic, Stylish & Versatile Protective Styles"
      description="Box braids are a timeless, classic protective style that comes in small, medium, and jumbo sizes. Perfect for all occasions and suitable for all hair types."
      startingPrice={150}
      duration="4–7 hours"
      hairIncluded
      benefits={[
        "Classic & timeless style",
        "Comes in 3 sizes",
        "Long-lasting 6–8 weeks",
        "Versatile — up or down",
        "Great protective style",
        "Works for all occasions",
        "Easy daily maintenance",
        "All hair types welcome",
      ]}
      variants={[
        { name: "Small Box Braids", description: "Tiny, delicate braids that offer maximum versatility and a sleek look.", price: "$180+" },
        { name: "Medium Box Braids", description: "The classic size — beautiful, balanced and most popular with our clients.", price: "$150+" },
        { name: "Jumbo Box Braids", description: "Bold, large braids that are quick to install and make a powerful statement.", price: "$130+" },
      ]}
      faqs={[
        { q: "How long do box braids last?", a: "Box braids typically last 6–8 weeks with proper care and maintenance." },
        { q: "Can I get colored box braids?", a: "Absolutely! We can install braids in any color. Please bring your preferred hair color or discuss with us when booking." },
        { q: "What size should I choose?", a: "It depends on your preference. Small braids are delicate, medium are most popular, and jumbo are bold and quick to install." },
        { q: "Do you provide hair?", a: "Yes! We can provide X-Pression or Kanekalon hair for an additional fee." },
      ]}
      aftercare={[
        "Oil your scalp 2–3 times per week",
        "Wrap in a satin bonnet or use a satin pillowcase",
        "Wash every 2–3 weeks with diluted shampoo",
        "Avoid heavy products that cause buildup",
        "Do not leave in longer than 8 weeks",
        "Moisturize braids with a light braid spray",
      ]}
    />
  );
}
