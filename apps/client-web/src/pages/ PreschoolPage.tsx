import "../components/home/common/HomePage.css"

import FinalCTA from "../components/preschool/FinalCTA";
import Hero from "../components/preschool/Hero";
import HearThisALot from "../components/preschool/HearThisALot";
import Pricing from "../components/preschool/Pricing";
import SeeItInAction from "../components/preschool/SeeItInAction";
import StatsBar from "../components/preschool/StatsBar";
import Testimonial from "../components/preschool/Testimonial";
import WhatWeActuallyDo from "../components/preschool/WhatWeActuallyDo";
import WhyPartner from "../components/preschool/WhyPartner";

export default function PreschoolPage() {
  return (
    <div className="gf-scope">
      <Hero />
      <HearThisALot />
      <StatsBar />
      <SeeItInAction />
      <WhatWeActuallyDo />
      <WhyPartner />
      <Testimonial />
      <Pricing />
      <FinalCTA />
    </div>
  );
}