import { useState } from "react";
import { asset } from "../data.js";
import { siteHref, officialRoot } from "../site.js";
import Icon from "../components/Icon.jsx";

const regionList = [
  ["Приморский край", "primkrai", "Море. Наука. Новые индустрии.", "primorye"],
  ["Хабаровский край", "khabkrai", "Города на Амуре."],
  ["Камчатский край", "kamchatka", "Между вулканами и океаном."],
  [
    "Республика Бурятия",
    "buryatia",
    "Байкал. Культура. Большие маршруты.",
    "buryatia",
  ],
  ["Республика Саха (Якутия)", "yakutia", "Северный масштаб."],
  ["Чукотский автономный округ", "chukot", "На краю двух океанов."],
  ["Забайкальский край", "zabaikal", "Территория связей."],
  ["Амурская область", "amurskaya", "Большое развитие на Амуре."],
  ["Сахалинская область", "sakhalin", "Энергия островов."],
  ["Еврейская автономная область", "eao", "Города, природа, культура."],
  ["Магаданская область", "magadan", "Характер северного города."],
];
const news = [
  {
    title: "Расходы на мастер-планы Арктики до 2035 года",
    date: "23.04.2026",
    dateTime: "2026-04-23",
    image: "news-arctic.webp",
    url: "/news/tpost/4d989jj9g1-trutnev-otsenil-rashodi-na-realizatsiyu",
  },
  {
    title: "В Магадане открыт лыжный стадион имени Елены Вяльбе",
    date: "12.04.2026",
    dateTime: "2026-04-12",
    image: "news-magadan.webp",
    url: "/news/tpost/6oyz6g5nc1-v-magadane-torzhestvenno-otkrit-klyuchev",
  },
  {
    title: "Мурманская агломерация: развитие для людей",
    date: "10.04.2026",
    dateTime: "2026-04-10",
    image: "news-murmansk.webp",
    url: "/news/tpost/1v564pmd81-arktika-dlya-lyudei-master-plan-murmansk",
  },
];
const partners = [
  "Минвостокразвития России",
  "Правительство Приморского края",
  "ДОМ.РФ",
  "Корпорация развития Дальнего Востока и Арктики",
  "Правительство Сахалинской области",
  "Правительство Амурской области",
  "Правительство Республики Бурятия",
  "Правительство Забайкальского края",
  "Правительство Хабаровского края",
  "Правительство Республики Саха (Якутия)",
  "Правительство Еврейской автономной области",
  "Правительство Камчатского края",
  "Правительство Чукотского автономного округа",
  "Правительство Магаданской области",
];
const faq = [
  [
    "Какую задачу решает мастер-план?",
    "Он связывает городские проекты с качеством жизни: определяет приоритеты, способы реализации и источники финансирования.",
  ],
  [
    "Чем он отличается от генерального плана?",
    "Генплан отвечает на вопросы о размещении застройки. Мастер-план объясняет, как и зачем будет развиваться город.",
  ],
  [
    "Для кого создаётся мастер-план?",
    "Для жителей, бизнеса и власти. Это открытая стратегия, которая помогает договориться об общем будущем города.",
  ],
];

function Question({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="home-question"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        <span>0{index + 1}</span>
        <h3>{question}</h3>
        <Icon name="plus" active={open} activeName="minus" size={24} />
      </summary>
      <p>{answer}</p>
    </details>
  );
}

function RegionExplorer() {
  const [active, setActive] = useState(0);
  const r = regionList[active];
  const href = r[3] ? siteHref(r[3]) : `${officialRoot}/${r[1]}`;
  return (
    <section
      className="home-region-section"
      id="regions"
      aria-labelledby="home-regions-title"
    >
      <div className="shell">
        <div className="section-head reveal">
          <span className="section-kicker">02 / География перемен</span>
          <span className="section-aside">
            11 регионов
            <br />
            Один Дальний Восток
          </span>
        </div>
        <div className="regions-heading reveal">
          <h2 className="section-title" id="home-regions-title">
            У каждого региона
            <br />
            <span>свой характер.</span>
          </h2>
          <span className="regions-hint">
            <Icon name="pin" size={20} /> Выберите регион
          </span>
        </div>
        <div className="home-region-explorer reveal">
          <div className="home-region-list" aria-label="Регионы-участники">
            {regionList.map((item, i) => (
              <button
                key={item[1]}
                aria-pressed={i === active}
                aria-controls="region-preview"
                onClick={() => setActive(i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{item[0]}</strong>
                <Icon
                  name="arrow"
                  active={i === active}
                  activeName="right"
                  size={23}
                />
              </button>
            ))}
          </div>
          <article
            className="home-region-preview"
            id="region-preview"
            aria-live="polite"
          >
            <img
              key={active}
              src={asset(`home-region-${active + 1}.webp`)}
              alt={`Пейзаж региона: ${r[0]}`}
              loading="lazy"
            />
            <div className="region-preview-shade" />
            <div className="region-preview-top">
              <span>Дальний Восток</span>
              <span>{String(active + 1).padStart(2, "0")} / 11</span>
            </div>
            <div className="region-preview-copy" key={r[1]}>
              <span className="section-kicker">{r[2]}</span>
              <h3>{r[0]}</h3>
              <a
                className="primary-link"
                href={href}
                target={r[3] ? undefined : "_blank"}
                rel={r[3] ? undefined : "noreferrer"}
              >
                {r[3] ? "Исследовать регион" : "Мастер-планы региона"}
                <Icon
                  name={r[3] ? "arrow" : "external"}
                  hoverName="right"
                  size={24}
                />
              </a>
              {!r[3] && <small>На портале «25 городов»</small>}
            </div>
          </article>
        </div>
        <a
          className="home-map-link"
          href={siteHref("vladivostok", "#projects")}
        >
          <span>
            <Icon name="pin" size={25} />
            <strong>Загляните в будущее Владивостока</strong>
            <small>27 согласованных проектов в атласе развития</small>
          </span>
          <Icon name="arrow" hoverName="right" size={27} />
        </a>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <div className="home-ocean">
        <section className="home-hero" aria-labelledby="home-title">
          <img
            className="home-hero-image"
            src={asset("home-hero.webp")}
            alt="Русский мост и побережье Владивостока"
            fetchPriority="high"
          />
          <div className="home-hero-shade" />
          <div className="shell home-hero-inner">
            <div className="home-hero-topline">
              <span>Россия / Дальний Восток</span>
              <span>25 городов — новый облик</span>
            </div>
            <div className="home-hero-heading">
              <p className="hero-eyebrow">Стратегические мастер-планы</p>
              <h1 id="home-title">
                Дальний Восток.
                <br />
                <span>Время городов.</span>
              </h1>
              <p>
                Города для жизни, работы и будущего.
                <br />
                От Байкала до Тихого океана.
              </p>
            </div>
            <div className="home-hero-bottom">
              <a href="#regions" className="hero-explore">
                <span className="round-arrow">
                  <Icon name="diagonal" hoverName="down" size={28} />
                </span>
                <span>
                  Выбрать
                  <br />
                  свой регион
                </span>
              </a>
              <div className="home-hero-stat">
                <strong>25</strong>
                <span>
                  городов
                  <br />
                  меняют будущее
                </span>
              </div>
              <a className="home-scroll" href="#about">
                <span>Узнать о проекте</span>
                <Icon name="down" size={24} />
              </a>
            </div>
          </div>
        </section>
        <section
          className="home-about"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="shell">
            <div className="section-head reveal">
              <span className="section-kicker">01 / О проекте</span>
              <span className="section-aside">
                Люди. Возможности.
                <br />
                Качество жизни.
              </span>
            </div>
            <div className="home-about-layout reveal">
              <div className="home-big-number" aria-hidden="true">
                25<span>ГОРОДОВ</span>
              </div>
              <div>
                <h2 className="section-title" id="about-title">
                  Место, где
                  <br />
                  <span>хочется остаться.</span>
                </h2>
                <p>
                  Мастер-планы объединяют экономику, инфраструктуру и городскую
                  среду, чтобы у жителей Дальнего Востока было больше
                  возможностей для жизни и самореализации.
                </p>
                <div className="home-impact">
                  <strong>
                    4<span>млн+</span>
                  </strong>
                  <p>
                    жителей — в центре
                    <br />
                    городских преобразований
                  </p>
                </div>
              </div>
            </div>
            <div className="home-city-counts reveal">
              {[
                ["11", "региональных центров"],
                ["9", "городов свыше 50 тыс. жителей"],
                ["3", "города менее 50 тыс. жителей"],
                ["2", "столицы БАМа"],
              ].map(([n, label]) => (
                <div key={n}>
                  <strong>{n}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="home-explainer" aria-labelledby="explainer-title">
        <div className="shell home-explainer-layout">
          <div className="reveal">
            <span className="section-kicker">От стратегии к жизни</span>
            <h2 id="explainer-title">
              Что меняет
              <br />
              <span>мастер-план.</span>
            </h2>
            <p>
              Понятный маршрут
              <br />к общему будущему города.
            </p>
          </div>
          <div className="reveal">
            {faq.map(([question, answer], i) => (
              <Question
                key={question}
                question={question}
                answer={answer}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
      <RegionExplorer />
      <section
        className="home-quarter-section"
        id="quarter"
        aria-labelledby="quarter-title"
      >
        <div className="shell">
          <div className="section-head reveal">
            <span className="section-kicker">03 / Дальневосточный квартал</span>
            <span className="section-aside">
              Новые дома.
              <br />
              Новая среда жизни.
            </span>
          </div>
          <div className="home-quarter reveal">
            <img
              src={asset("home-quarter.webp")}
              alt="Жилой квартал — визуализация с портала проекта"
              loading="lazy"
            />
            <div className="home-quarter-shade" />
            <div className="home-quarter-copy">
              <span className="section-kicker">Дом начинается с города</span>
              <h2 id="quarter-title">
                Больше,
                <br />
                чем жильё.
              </h2>
              <p>
                Комфортные кварталы на территориях опережающего развития.
                Доступное жильё и инфраструктура для повседневной жизни.
              </p>
              <a
                className="primary-link"
                href={`${officialRoot}/dvkvartal`}
                target="_blank"
                rel="noreferrer"
              >
                О программе <Icon name="external" size={23} />
              </a>
            </div>
            <dl className="home-quarter-stats">
              {[
                ["1,8", "млн м²", "жилой площади"],
                ["69", "тыс. человек", "обеспечены жильём"],
                ["1,2", "млн м²", "социального жилья"],
                ["202", "млрд ₽", "инвестиций"],
              ].map(([v, u, l]) => (
                <div key={l}>
                  <dt>{l}</dt>
                  <dd>
                    {v}
                    <small>{u}</small>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="home-partners" aria-labelledby="partners-title">
        <div className="shell">
          <div className="section-head reveal">
            <h2 id="partners-title">Развитие — общая работа.</h2>
            <span className="section-aside">Партнёры проекта</span>
          </div>
          <div className="partner-grid reveal">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i}>
                <img
                  src={asset(`partner-${i + 1}.webp`)}
                  alt={partners[i]}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="home-news" id="news" aria-labelledby="news-title">
        <div className="shell">
          <div className="section-head reveal">
            <span className="section-kicker">04 / События</span>
            <a
              className="text-link"
              href={`${officialRoot}/news`}
              target="_blank"
              rel="noreferrer"
            >
              Все новости <Icon name="arrow" hoverName="right" size={23} />
            </a>
          </div>
          <h2 className="section-title reveal" id="news-title">
            Города меняются.
            <br />
            <span>Истории продолжаются.</span>
          </h2>
          <div className="news-grid reveal">
            {news.map((n) => (
              <a
                className="news-card"
                href={officialRoot + n.url}
                key={n.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="news-image">
                  <img src={asset(n.image)} alt="" loading="lazy" />
                  <span>
                    <Icon name="arrow" hoverName="right" size={24} />
                  </span>
                </div>
                <time dateTime={n.dateTime}>{n.date}</time>
                <h3>{n.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
