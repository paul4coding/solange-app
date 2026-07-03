import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Passion Twist",
  description: "Passion twist in Glen Burnie, MD. Soft, lightweight & natural-looking twists. Starting at $190. Book your appointment today!",
};

export default function PassionTwistPage() {
  return (
    <ServicePageTemplate
      slug="passion-twist"
      name="Passion Twist"
      category="Twists"
      tagline="Soft, Lightweight & Natural-Looking Twists"
      description="Passion twists are a beautiful, soft twist style that uses water-wave or curly hair extensions to create a textured, bohemian twist with a natural, carefree look."
      startingPrice={190}
      duration="4–6 hours"
      hairIncluded
      benefits={[
        "Soft & natural texture",
        "Lightweight feel",
        "Bohemian & romantic",
        "Protective style",
        "Great for all seasons",
        "Low maintenance",
        "Beautiful movement",
        "Long-lasting 4–6 weeks",
      ]}
      variants={[
        { name: "Small Passion Twists", description: "Thin, delicate twists with a more defined curly texture.", price: "$210+" },
        { name: "Medium Passion Twists", description: "Most popular size — perfect balance of volume and definition.", price: "$190+" },
        { name: "Large Passion Twists", description: "Bold, chunky twists with lots of volume and texture.", price: "$170+" },
      ]}
      faqs={[
        { q: "What is the difference between passion twists and Senegalese twists?", a: "Passion twists use textured, curly water-wave hair giving them a softer, more bohemian look, while Senegalese twists use smooth hair for a sleeker appearance." },
        { q: "How long do passion twists last?", a: "Passion twists typically last 4–6 weeks. The textured sections may frizz slightly over time." },
        { q: "Can I get passion twists in different colors?", a: "Yes! We offer passion twists in ombre, highlighted, and solid color options." },
        { q: "Are passion twists heavy?", a: "Passion twists are designed to be lightweight despite their voluminous appearance." },
      ]}
      aftercare={[
        "Use a curl-refreshing spray to revive the texture",
        "Sleep with a large satin bonnet",
        "Avoid heavy products that weigh down twists",
        "Oil your scalp regularly",
        "Do not leave in longer than 6 weeks",
        "Wash gently to preserve the texture",
      ]}
    />
  );
}
