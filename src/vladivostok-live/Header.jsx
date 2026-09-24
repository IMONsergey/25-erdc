import {siteHref} from "../site.js";
import { useEffect, useState } from "react";
import { asset } from "../vladivostok-20260922/data.js";
import Icon from "../vladivostok-20260922/components/Icon.jsx";
export default function Header() {
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
        <a className="brand" href={siteHref()} aria-label="25 городов — на главную">
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
          {[
            [siteHref(), "Главная"],
            [siteHref("regions"), "Регионы"],
            [siteHref("about"), "О проекте"],
            [siteHref("news"), "Новости"],
          ].map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#projects">
          Изучить мастер-план <Icon name="arrow" hoverName="right" size={20} />
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

