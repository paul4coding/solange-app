import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Loc Retwist",
  description: "Professional loc retwist in Glen Burnie, MD. Keep your locs neat and healthy. Starting at $80. Expert loc maintenance by Tiffany.",
};

export default function LocRetwistPage() {
  return (
    <ServicePageTemplate
      slug="loc-retwist"
      name="Loc Retwist"
      category="Loc Services"
      tagline="Keep Your Locs Neat, Healthy & Beautiful"
      description="Regular retwisting is essential for maintaining healthy, neat locs. Our loc specialist Tiffany provides expert retwists that keep your roots clean and your locs looking their best."
      startingPrice={80}
      duration="2–3 hours"
      benefits={[
        "Keeps roots neat & defined",
        "Promotes healthy loc growth",
        "Prevents matting & fusing",
        "Expert loc specialist",
        "Scalp cleansing included",
        "Loc conditioning option",
        "All stages welcome",
        "Maintains loc shape",
      ]}
      variants={[
        { name: "Basic Retwist", description: "Clean retwist to maintain neat roots and defined locs.", price: "$80+" },
        { name: "Retwist + Wash", description: "Deep cleanse followed by a thorough retwist.", price: "$100+" },
        { name: "Retwist + Style", description: "Retwist with creative styling — updo, bun, or other styles.", price: "$120+" },
      ]}
      faqs={[
        { q: "How often should I retwist my locs?", a: "Most loc clients come in every 4–6 weeks. New locs may need more frequent visits (every 3–4 weeks) to stay neat during the budding stage." },
        { q: "Should I wash before my retwist appointment?", a: "No — please come with clean hair. We will cleanse your scalp as part of the service, or you can wash 1–2 days before." },
        { q: "How long does a retwist take?", a: "A retwist typically takes 2–3 hours depending on the number and length of your locs." },
        { q: "Can you style my locs after retwisting?", a: "Yes! We offer styling services including updo, bun, and other creative styles after your retwist." },
      ]}
      aftercare={[
        "Allow locs to dry completely before covering",
        "Apply loc oil or butter to moisturize",
        "Avoid sleeping with wet locs",
        "Use a satin bonnet or silk pillowcase",
        "Avoid picking or separating locs at the root",
        "Return every 4–6 weeks for maintenance",
      ]}
    />
  );
}
