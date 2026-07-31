import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Feed-In Braids",
  description: "Professional feed-in braids in Glen Burnie, MD. Neat, clean cornrows close to the scalp. Starting at $60. Perfect for all ages.",
};

export default function FeedInBraidsPage() {
  return (
    <ServicePageTemplate
      slug="feed-in-braids"
      name="Feed-In Braids"
      category="Cornrows"
      tagline="Neat, Clean & Stylish Cornrows"
      description="Feed-in braids are a modern cornrow technique where hair extensions are gradually fed in to create natural-looking cornrows without a bulky knot at the root. Perfect for a clean, professional look."
      startingPrice={60}
      duration="2–3 hours"
      hairIncluded
      benefits={[
        "Less tension on scalp",
        "Natural-looking roots",
        "Clean & professional look",
        "Long-lasting style",
        "Great for all ages",
        "Quick installation",
        "Versatile designs",
        "Perfect for athletes",
      ]}
      variants={[
        { name: "Straight Back Feed-In", description: "Classic straight-back cornrows — clean and timeless.", price: "$60+" },
        { name: "Feed-In Ponytail", description: "Cornrows that flow into a sleek ponytail — elegant and practical.", price: "$80+" },
        { name: "Designer Feed-In", description: "Geometric patterns and creative designs for a unique, artistic look.", price: "$100+" },
      ]}
      faqs={[
        { q: "How long do feed-in braids last?", a: "Feed-in braids typically last 2–4 weeks, depending on your hair growth and maintenance." },
        { q: "What's the difference between regular cornrows and feed-in braids?", a: "Feed-in braids gradually add extensions at the root for a more natural look with less tension than traditional cornrows." },
        { q: "Are feed-in braids good for kids?", a: "Yes! Feed-in braids are great for kids because they're low-tension and protective." },
        { q: "Can I do any design I want?", a: "Absolutely! We can create geometric patterns, curves, zigzags, and custom designs. Show us your inspiration photos!" },
      ]}
      aftercare={[
        "Apply edge control to keep edges neat",
        "Oil scalp between braids daily",
        "Sleep with a satin scarf to maintain the style",
        "Avoid excessive moisture which can cause frizz",
        "Do not keep in longer than 4 weeks",
        "Gently clean scalp with diluted shampoo",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
