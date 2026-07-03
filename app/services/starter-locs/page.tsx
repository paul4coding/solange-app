import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Starter Locs",
  description: "Start your loc journey at Solange's Hair Braiding in Glen Burnie, MD. Professional starter locs with expert guidance. Starting at $100.",
};

export default function StarterLocsPage() {
  return (
    <ServicePageTemplate
      slug="starter-locs"
      name="Starter Locs"
      category="Loc Services"
      tagline="Begin Your Loc Journey with Expert Guidance"
      description="Starting your loc journey is a big step and we're here to guide you every step of the way. Our experienced stylists will help you choose the best method and size for your hair type and desired look."
      startingPrice={100}
      duration="2–4 hours"
      benefits={[
        "Expert loc consultation",
        "Multiple starting methods",
        "Tailored to your hair type",
        "Detailed aftercare guide",
        "Long-term loc care plan",
        "Patience & expertise",
        "All hair types welcome",
        "Natural hair protection",
      ]}
      variants={[
        { name: "Two-Strand Twist Starter Locs", description: "Most popular method — twists are left to lock over time naturally.", price: "$100+" },
        { name: "Comb Coil Starter Locs", description: "Perfect for shorter hair or very curly textures.", price: "$120+" },
        { name: "Palm Roll Starter Locs", description: "Hand-rolling technique for a neat, uniform loc start.", price: "$110+" },
      ]}
      faqs={[
        { q: "What is the best method for starting locs?", a: "The best method depends on your hair type, texture, and desired size. We'll consult with you to determine the best approach." },
        { q: "How long does it take for locs to fully lock?", a: "Locs typically take 6–18 months to fully mature, depending on your hair texture, care routine, and the starting method used." },
        { q: "What size should my locs be?", a: "Loc size is a personal preference. Thin locs require more of them, while thicker locs require fewer. We'll help you decide based on your hair density." },
        { q: "How often should I come back for maintenance?", a: "We recommend returning every 4–6 weeks for retwisting during the early stages of your loc journey." },
        { q: "Can I wash my starter locs?", a: "Yes, but be careful during the early stages. We recommend waiting 2–3 weeks before the first wash and using a residue-free shampoo." },
      ]}
      aftercare={[
        "Avoid washing for the first 2–3 weeks",
        "Use a residue-free, loc-safe shampoo",
        "Moisturize locs with a light oil or loc spray",
        "Sleep with a satin bonnet or silk pillowcase",
        "Avoid heavy products that cause buildup",
        "Come in for regular retwists every 4–6 weeks",
        "Be patient — locs take time to fully mature",
      ]}
    />
  );
}
