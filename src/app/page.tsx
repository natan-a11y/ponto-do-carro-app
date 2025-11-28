"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { UnitsSection } from "@/components/sections/units-section";
import { FaqSection } from "@/components/sections/faq-section";


export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HowItWorksSection />
      <UnitsSection />
      <SocialProofSection />
      <FaqSection maxItems={4} />
    </div>
  );
}
