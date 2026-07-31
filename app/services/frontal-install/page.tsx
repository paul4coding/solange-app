import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Frontal Install",
  description: "Professional frontal install in Glen Burnie, MD. Flawless lace frontal installation for a natural hairline. Starting at $150.",
};

export default function FrontalInstallPage() {
  return (
    <ServicePageTemplate
      slug="frontal-install"
      name="Frontal Install"
      category="Weaves & Lace"
      tagline="Flawless Frontal Installation for a Natural Hairline"
      description="A lace frontal install gives you a completely natural-looking hairline from ear to ear. Our skilled stylists provide flawless installation that blends seamlessly with your natural hair."
      startingPrice={150}
      duration="3–4 hours"
      benefits={[
        "Natural-looking hairline",
        "Ear-to-ear coverage",
        "Versatile parting options",
        "Blend with natural hair",
        "Professional adhesive",
        "HD lace available",
        "Multiple install methods",
        "Long-lasting result",
      ]}
      variants={[
        { name: "13x4 Lace Frontal", description: "Standard frontal coverage from ear to ear.", price: "$150+" },
        { name: "13x6 Lace Frontal", description: "Wider parting space for more versatile styling options.", price: "$175+" },
        { name: "HD Lace Frontal", description: "Undetectable HD lace that melts seamlessly into any skin tone.", price: "$200+" },
      ]}
      faqs={[
        { q: "Do I need to bring my own frontal?", a: "Yes, please bring your own lace frontal unit. We provide the installation service. If you need help choosing one, ask us when booking." },
        { q: "How is the frontal secured?", a: "We use professional-grade adhesive or glueless methods depending on your preference and lifestyle." },
        { q: "How long does a frontal install last?", a: "A properly installed frontal typically lasts 3–6 weeks depending on your lifestyle, perspiration level, and maintenance." },
        { q: "What is the difference between a frontal and a closure?", a: "A frontal covers the entire hairline from ear to ear (13 inches), while a closure covers just the parting area (4x4 or 5x5 inches)." },
        { q: "Can I swim or exercise with a frontal?", a: "We recommend avoiding excessive sweat and swimming, as this can loosen the adhesive. Glueless installs are better for active lifestyles." },
      ]}
      aftercare={[
        "Avoid excessive sweat or moisture for the first 24–48 hours",
        "Tie down edges at night with a silk scarf",
        "Use minimal products directly on the lace",
        "Clean the hairline gently with alcohol and cotton swab",
        "Return every 3–4 weeks for repositioning",
        "Avoid pulling or tugging on the lace",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
