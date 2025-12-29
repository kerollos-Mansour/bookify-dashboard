"use client";

import HeroSection from "@/components/vendor-landing/HeroSection";
import BenefitsSection from "@/components/vendor-landing/BenefitsSection";
import HowItWorksSection from "@/components/vendor-landing/HowItWorksSection";
import FeaturesSection from "@/components/vendor-landing/FeaturesSection";
import TestimonialsSection from "@/components/vendor-landing/TestimonialsSection";
import ApplicationForm from "@/components/vendor-landing/ApplicationForm";
import FAQSection from "@/components/vendor-landing/FAQSection";
import FinalCTA from "@/components/vendor-landing/FinalCTA";

export default function VendorJoinPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ApplicationForm />
      <FAQSection />
      <FinalCTA />
    </div>
  );
}
