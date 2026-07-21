import { Hero } from "@/components/programs/Hero";
import { VideoComparison } from "@/components/programs/VideoComparison";
import { ProgramCards } from "@/components/programs/ProgramCards";
import { MapSection } from "@/components/programs/MapSection";
import { Testimonials } from "@/components/programs/Testimonials";
import { BottomBar } from "@/components/programs/BottomBar";

export default function ProgramsPage() {
  return (
    <div className="gf-scope">
      <Hero />
      <VideoComparison />
      <ProgramCards />
      <MapSection />
      <Testimonials />
      <BottomBar />
    </div>
  );
}