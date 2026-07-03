import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";

export const metadata: Metadata = {
  title: "Kids Braids",
  description: "Kids hair braiding in Glen Burnie, MD. Kid-friendly styles for all ages. Starting at $45. Gentle, fun and beautiful styles for your little one.",
};

export default function KidsBraidsPage() {
  return (
    <ServicePageTemplate
      slug="kids-braids"
      name="Kids Braids"
      category="Kids Styles"
      tagline="Cute, Creative & Kid-Friendly Styles"
      description="We specialize in kid-friendly braiding styles that are gentle on young scalps, fun, and beautiful. Our stylists are experienced and patient with children of all ages."
      startingPrice={45}
      duration="1–3 hours"
      hairIncluded
      benefits={[
        "Gentle on young scalps",
        "Kid-friendly environment",
        "Patient & caring stylists",
        "Fast installation",
        "Protective style",
        "School-appropriate styles",
        "Great for all ages",
        "Fun colors available",
      ]}
      variants={[
        { name: "Kids Cornrows", description: "Classic, neat cornrows perfect for school and everyday activities.", price: "$45+" },
        { name: "Kids Box Braids", description: "Small to medium box braids — great protective style for kids.", price: "$65+" },
        { name: "Kids Knotless Braids", description: "Gentle knotless braids with less tension — perfect for sensitive scalps.", price: "$80+" },
        { name: "Kids Twists", description: "Fun, soft twists that are easy to maintain for busy kids.", price: "$55+" },
      ]}
      faqs={[
        { q: "What age do you start braiding children?", a: "We can braid children of all ages! For very young children (under 3), we recommend simple styles that are gentle on their delicate scalps." },
        { q: "How long does a kids appointment take?", a: "Kids appointments typically take 1–3 hours depending on the style and the child's hair." },
        { q: "Can parents stay during the appointment?", a: "Absolutely! Parents are welcome to stay with their children throughout the appointment." },
        { q: "Do you use gentle products for kids?", a: "Yes! We use gentle, child-safe products and are especially careful with children's delicate scalps." },
        { q: "Can we add fun colors or accessories?", a: "Of course! We offer fun beads, accessories, and even colorful hair extensions for kids who want to express themselves." },
      ]}
      aftercare={[
        "Apply a light children's hair oil to scalp daily",
        "Use a satin bonnet or pillowcase at night",
        "Gently re-oil edges after gym or sports",
        "Wash every 2 weeks with gentle shampoo",
        "Don't keep braids in longer than 4 weeks for young children",
        "Detangle gently at removal to minimize breakage",
      ]}
    />
  );
}
