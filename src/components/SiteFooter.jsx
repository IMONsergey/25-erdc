import Icon from "./Icon.jsx";
import { asset } from "../data.js";
import { siteHref, officialRoot } from "../site.js";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-top">
        <a href={siteHref()} aria-label="25 городов — главная">
          <img
            src={asset("logo-25-cities.svg")}
            alt="25 городов"
            width="130"
            height="32"
          />
        </a>
        <p>
          Новый облик городов
          <br />
          Дальнего Востока
        </p>
        <a href="#top">
          Вернуться к началу <Icon name="arrow" hoverName="up" size={24} />
        </a>
      </div>
      <nav className="shell footer-routes" aria-label="Страницы сайта">
        <a href={siteHref()}>Главная</a>
        <a href={siteHref("primorye")}>Приморский край</a>
        <a href={siteHref("buryatia")}>Республика Бурятия</a>
        <a href={siteHref("vladivostok")}>Владивосток</a>
        <a href={`${officialRoot}/news`} target="_blank" rel="noreferrer">
          Новости <Icon name="external" size={15} />
        </a>
      </nav>
      <div className="shell footer-bottom">
        <span>Корпорация развития Дальнего Востока и Арктики · 2026</span>
        <a href="tel:88007075558">8 (800) 707-55-58</a>
      </div>
    </footer>
  );
}
