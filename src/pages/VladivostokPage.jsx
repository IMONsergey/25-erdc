import { useState } from "react";
import Hero from "../components/Hero.jsx";
import Regions from "../components/Regions.jsx";
import Mission from "../components/Mission.jsx";
import Projects from "../components/Projects.jsx";
import Motion from "../components/Motion.jsx";

// The approved page is composed from its original, unchanged blocks.
// Portal typography and resets must not cascade into this page.
export default function VladivostokPage() {
  const [selectedCity, setSelectedCity] = useState("vladivostok");
  return <>
    <div className="ocean-zone">
      <Hero />
      <Regions selectedCity={selectedCity} onSelectCity={setSelectedCity} />
    </div>
    <Mission />
    <Projects />
    <Motion />
  </>;
}
