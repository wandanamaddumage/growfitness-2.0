import { useState } from 'react';

import '@/components/home/common/HomePage.css';
import { ChallengesSection, CTASection, FAQSection, FeaturesSection, ForNotForSection, HeadCoachSection, HeroSection, HowItWorksSection, ProgramsSection, StatsSection, TestimonialsSection, VideoSection } from '@/components/home';
import { ArrowRight } from 'lucide-react';


export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);

  return (
    <div className="gf-scope">
      <HeroSection slide={slide} setSlide={setSlide} />
      <TestimonialsSection />
      <StatsSection />
      <FeaturesSection />
      <ProgramsSection />
      <ChallengesSection />
      <ForNotForSection />
      <HowItWorksSection />
      <HeadCoachSection />
      <VideoSection />
      <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      
      {/* Blog teaser */}
      <div className="px-6 md:px-12 py-7 text-center" style={{ background: "var(--gf-cream)", borderTop: "1.5px solid var(--line)" }}>
        <p className="inline-flex items-center gap-2 flex-wrap justify-center text-[15px]" style={{ color: "var(--fg-2)" }}>
          Want more tips on raising active kids?
          <a href="#" className="font-bold inline-flex items-center gap-1.5" style={{ color: "var(--gf-green)" }}>
            Read our blog
            <ArrowRight size={13} strokeWidth={2.5} />
          </a>
        </p>
      </div>
      
      <CTASection />
    </div>
  );
}