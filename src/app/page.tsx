import { BlogPreview } from "@/components/home/blog-preview";
import { CollectionSpotlight } from "@/components/home/collection-spotlight";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PreviewShowcase } from "@/components/home/preview-showcase";
import { PricingOverview } from "@/components/home/pricing-overview";
import { Testimonials } from "@/components/home/testimonials";
import { TrustSection } from "@/components/home/trust-section";
import { WhyItWorks } from "@/components/home/why-it-works";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <HowItWorks />
      <CategoriesShowcase />
      <CollectionSpotlight />
      <WhyItWorks />
      <PreviewShowcase />
      <PricingOverview />
      <Testimonials />
      <BlogPreview />
      <FaqSection />
      <FinalCta />
    </>
  );
}
