import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Butterfly Locs",
  description: "Beautiful butterfly locs in Glen Burnie, MD. Soft, flowy bohemian locs with stunning texture. Starting at $200. Book your appointment today!",
  keywords: ["butterfly locs glen burnie", "butterfly locs maryland", "faux locs md", "bohemian locs"],
};

export default function ButterflyLocsPage() {
  return (
    <ServicePageTemplate
      slug="butterfly-locs"
      name="Butterfly Locs"
      category="Locs"
      tagline="Soft, Flowy & Effortlessly Beautiful"
      description="Butterfly locs are a trendy, bohemian-inspired protective style featuring distressed, soft locs with a unique looped texture. They're lightweight, low-tension, and absolutely stunning — perfect for a natural, free-spirited look."
      startingPrice={200}
      duration="5–8 hours"
      hairIncluded
      benefits={[
        "Lightweight & low tension on scalp",
        "Gorgeous bohemian texture",
        "No heat required",
        "Lasts 6–8 weeks",
        "Works on all hair types",
        "Low daily maintenance",
        "Versatile styling options",
        "Trendy yet timeless look",
      ]}
      variants={[
        { name: "Short Butterfly Locs", description: "Shoulder-length or above — bold and chic. Great for a first-time loc experience.", price: "$200+" },
        { name: "Medium Butterfly Locs", description: "Mid-back length — our most popular choice. Perfect balance of volume and manageability.", price: "$220+" },
        { name: "Long Butterfly Locs", description: "Waist-length and beyond. Dramatic, luxurious, and head-turning.", price: "$250+" },
      ]}
      faqs={[
        { q: "How long do butterfly locs last?", a: "With proper care, butterfly locs last 6–8 weeks. They tend to frizz with time, so we recommend refreshing or removing them around the 8-week mark." },
        { q: "Is hair included?", a: "Yes! We use quality water wave or passion twist hair to achieve the butterfly texture. You can also bring your own preferred hair." },
        { q: "How long does the appointment take?", a: "Butterfly locs take 5–8 hours depending on the length and size chosen. We recommend booking an early appointment." },
        { q: "Do I need a deposit?", a: "Yes, a $30 non-refundable deposit secures your appointment and is applied toward your total." },
        { q: "How do I take care of butterfly locs?", a: "Keep your scalp moisturized, sleep with a satin bonnet, and avoid excessive manipulation. You can carefully refresh frizzy sections with a crochet needle." },
        { q: "Can I get butterfly locs wet?", a: "It's best to keep them dry. If washing, use a diluted shampoo applied mainly to the scalp, and let them air dry fully." },
      ]}
      aftercare={[
        "Moisturize scalp daily with a light oil or loc spray",
        "Sleep with a satin bonnet or scarf every night",
        "Avoid pulling or excessive manipulation",
        "Refresh frizzy sections with a crochet needle if needed",
        "Keep locs dry — minimize exposure to water",
        "Remove before the 8-week mark to prevent matting",
      ]}
    />
  );
}

// Les photos viennent de la base : rendu à la demande pour que les ajouts
// faits dans l'admin apparaissent immédiatement.
export const dynamic = "force-dynamic";
