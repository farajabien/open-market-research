import HeroSection from "@/components/sections/hero-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import WhySection from "@/components/sections/why-section";
import AudienceSection from "@/components/sections/audience-section";
import ExampleSection from "@/components/sections/example-section";
import CommunitySection from "@/components/sections/community-section";
import CTASection from "@/components/sections/cta-section";
import FooterSection from "@/components/sections/footer-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <HowItWorksSection />
      <WhySection />
      <AudienceSection />
      <ExampleSection />
      <CommunitySection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
