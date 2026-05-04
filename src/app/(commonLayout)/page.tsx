"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedTutors, { TutorProfile } from "@/components/home/FeaturedTutors";
import WhySkillBridge from "@/components/home/WhySkillBridge";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/tutors`, { cache: "no-store" })
      .then((r) => r.json())
      .then((result) => {
        if (result.data && Array.isArray(result.data)) {
          setFeaturedTutors(result.data.slice(0, 6));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [baseUrl]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorks />
      <FeaturedTutors tutors={featuredTutors} isLoading={isLoading} />
      <WhySkillBridge />
      <CTASection />
    </div>
  );
}
