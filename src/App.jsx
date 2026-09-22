import { useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Regions from "./components/Regions.jsx";
import Mission from "./components/Mission.jsx";
import Projects from "./components/Projects.jsx";
import Motion from "./components/Motion.jsx";
import Icon from "./components/Icon.jsx";
import { asset } from "./data.js";
export default function App() {
  const [selectedCity, setSelectedCity] = useState("vladivostok");
  return (
    <>
      <a className="skip-link" href="#content">
        Перейти к содержанию
      </a>
      <div id="top" />
      <Header />
      <main id="content">
        <div className="ocean-zone">
          <Hero />
          <Regions selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        </div>
        <Mission />
        <Projects />
      </main>
      <footer className="site-footer">
        <div className="shell footer-top">
          <img
            src={asset("logo-25-cities.svg")}
            alt="25 городов"
            width="130"
            height="32"
          />
          <p>
            Новый облик городов
            <br />
            Дальнего Востока
          </p>
          <a href="#top">
            Вернуться к началу <Icon name="arrow" hoverName="up" size={24} />
          </a>
        </div>
        <div className="shell footer-bottom">
          <span>Корпорация развития Дальнего Востока и Арктики · 2026</span>
          <a href="tel:88007075558">8 (800) 707-55-58</a>
        </div>
      </footer>
      <Motion />
    </>
  );
}
