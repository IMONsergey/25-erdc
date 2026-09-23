import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Regions from "./components/Regions.jsx";
import Mission from "./components/Mission.jsx";
import Projects from "./components/Projects.jsx";
import Motion from "./components/Motion.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import HomePage from "./pages/HomePage.jsx";
import PrimoryePage from "./pages/PrimoryePage.jsx";
import BuryatiaPage from "./pages/BuryatiaPage.jsx";
import { currentPage } from "./site.js";
export default function App() {
  const [selectedCity, setSelectedCity] = useState("vladivostok");
  return (
    <>
      <a className="skip-link" href="#content">
        Перейти к содержанию
      </a>
      <div id="top" />
      <Header />
      <main id="content" className={`page-${currentPage}`}>
        {currentPage === "home" ? (
          <HomePage />
        ) : currentPage === "primorye" ? (
          <PrimoryePage />
        ) : currentPage === "buryatia" ? (
          <BuryatiaPage />
        ) : (
          <>
            <div className="ocean-zone">
              <Hero />
              <Regions
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
              />
            </div>
            <Mission />
            <Projects />
          </>
        )}
      </main>
      <SiteFooter />
      <Motion />
    </>
  );
}
