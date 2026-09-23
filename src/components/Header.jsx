import { useEffect, useState } from "react";
import { asset } from "../data.js";
import Icon from "./Icon.jsx";
import { siteHref, currentPage } from "../site.js";
const pageLinks = {
  home: [
    ["#about", "О проекте"],
    ["#regions", "Регионы"],
    ["#quarter", "ДВ Квартал"],
    ["#news", "Новости"],
  ],
  primorye: [
    ["#cities", "Мастер-планы"],
    ["#potential", "Возможности"],
    ["#changes", "Развитие"],
  ],
  buryatia: [
    ["#cities", "Города"],
    ["#mission", "Миссия"],
    ["#directions", "Направления"],
    ["#projects", "Проекты"],
  ],
  vladivostok: [
    ["#city", "Город"],
    ["#regions", "Территории"],
    ["#mission", "Миссия"],
    ["#projects", "Проекты"],
  ],
};
export default function Header({ page = currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const key = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [menuOpen]);
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-inner shell">
        <a
          className="brand"
          href={siteHref()}
          aria-label="25 городов — на главную"
        >
          <img
            src={asset("logo-25-cities.svg")}
            alt="25 городов"
            width="112"
            height="26"
          />
        </a>
        <span className="header-caption">
          Новый облик городов
          <br />
          Дальнего Востока
        </span>
        <nav
          id="main-menu"
          className={`main-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Основная навигация"
        >
          {pageLinks[page].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="header-cta"
          href={page === "home" ? "#regions" : siteHref("", "#regions")}
        >
          {page === "home" ? "Выбрать регион" : "Все регионы"}{" "}
          <Icon name="arrow" hoverName="right" size={20} />
        </a>
        <button
          className={`menu-button ${menuOpen ? "is-open" : ""}`}
          aria-controls="main-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name="menu" active={menuOpen} activeName="close" size={26} />
        </button>
      </div>
    </header>
  );
}
