import Hero from "@/components/home/Hero";
import SignatureServices from "@/components/home/SignatureServices";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HomeGallery from "@/components/home/HomeGallery";
import Stats from "@/components/home/Stats";
import Reviews from "@/components/home/Reviews";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SignatureServices />
      <WhyChooseUs />
      <Stats />
      <HomeGallery />
      <Reviews />
      <CTABanner />
    </>
  );
}

// Hero, SignatureServices et HomeGallery lisent la base : rendu à la demande
// pour que les photos ajoutées dans l'admin apparaissent, et pour que le build
// ne fige pas une page vide quand la base n'est pas joignable (cas de Docker).
export const dynamic = "force-dynamic";
