import { useEffect, useState } from "react";
import { asset } from "../data.js";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="top">
      <div className="shell header-inner">
        <a className="header-caption" href="#top">Новый облик городов Дальнего Востока</a>
        <a className="brand" href="#top" aria-label="25 городов — на главную">
          <img src={asset("logo-25-cities.svg")} alt="25 городов" width="112" height="24" />
        </a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span /><span />
          <span className="visually-hidden">Открыть меню</span>
        </button>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} id="main-menu" aria-label="Основная навигация">
          <a href="#top" onClick={closeMenu}>Главная</a>
          <a href="#about" onClick={closeMenu}>О проекте</a>
          <a href="#regions" onClick={closeMenu}>Регионы</a>
          <a href="#projects" onClick={closeMenu}>ДВ Квартал</a>
          <a href="#projects" onClick={closeMenu}>Новости</a>
        </nav>
      </div>
    </header>
  );
}
