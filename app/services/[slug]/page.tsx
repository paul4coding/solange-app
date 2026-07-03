import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";
import { queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

type ServiceRow = {
  slug: string;
  name: string;
  category: string;
  description: string | null;
  starting_price: number;
  duration: string | null;
  is_featured: number;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await queryOne<ServiceRow>(
    "SELECT name, description FROM services WHERE slug = ? AND is_active = 1",
    [slug]
  ).catch(() => null);

  if (!service) return { title: "Service Not Found" };

  return {
    title: service.name,
    description:
      service.description ||
      `${service.name} at Solange's Hair Braiding in Glen Burnie, MD.`,
  };
}

export default async function DynamicServicePage({ params }: Props) {
  const { slug } = await params;

  const service = await queryOne<ServiceRow>(
    "SELECT * FROM services WHERE slug = ? AND is_active = 1",
    [slug]
  ).catch(() => null);

  if (!service) notFound();

  return (
    <ServicePageTemplate
      slug={service.slug}
      name={service.name}
      category={service.category}
      tagline={`Professional ${service.name} in Glen Burnie, MD`}
      description={
        service.description ||
        `Expert ${service.name} at Solange's Hair Braiding. Book your appointment today.`
      }
      startingPrice={service.starting_price}
      duration={service.duration || "3-6 hours"}
      hairIncluded
      benefits={[
        "Expert styling by trained professionals",
        "Premium quality hair products",
        "Healthy, tension-free technique",
        "Long-lasting results",
        "Welcoming and professional environment",
        "Walk-ins welcome — appointments recommended",
      ]}
      faqs={[
        {
          q: `How much does ${service.name} cost?`,
          a: `${service.name} starts at $${service.starting_price}. Final pricing depends on length, size, and hair included. Contact us for a personalized quote.`,
        },
        {
          q: "How long does the appointment take?",
          a: `${service.name} typically takes ${service.duration || "3-6 hours"}. We recommend booking early in the day.`,
        },
        {
          q: "Do I need a deposit?",
          a: "Yes, a $30 non-refundable deposit is required to secure your appointment. It is applied to your total service cost.",
        },
        {
          q: "Is hair included?",
          a: "We can provide quality braiding hair for an additional fee. You are also welcome to bring your own preferred hair.",
        },
      ]}
      aftercare={[
        "Moisturize your scalp regularly with a light oil",
        "Sleep with a satin bonnet or scarf",
        "Avoid excessive manipulation or pulling",
        "Keep hair clean — wash scalp every 2-3 weeks",
        "Follow up with your stylist for maintenance",
      ]}
    />
  );
}
