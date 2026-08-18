import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Regions from "./components/Regions.jsx";
import Mission from "./components/Mission.jsx";
import Projects from "./components/Projects.jsx";
import PagePreloader from "./components/PagePreloader.jsx";

export default function App() {
  const [selectedCity, setSelectedCity] = useState("vladivostok");
  const hasVladivostokContent = selectedCity === "vladivostok";

  return (
    <>
      <PagePreloader />
      <a className="skip-link" href="#content">Перейти к содержанию</a>
      <Header />
      <main id="content">
        <div className={`ocean-zone${hasVladivostokContent ? "" : " is-compact"}`}>
          <Hero />
          <Regions selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        </div>
        {hasVladivostokContent ? (
          <>
            <Mission />
            <Projects />
          </>
        ) : null}
      </main>
    </>
  );
}
