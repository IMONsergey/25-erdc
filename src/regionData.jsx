import { siteHref, officialRoot } from "./site.js";

export const regions = {
  primorye: {
    id: "primorye",
    code: "25",
    eyebrow: "Приморский край",
    title: (
      <>
        На берегу
        <br />
        <span>возможностей.</span>
      </>
    ),
    subtitle:
      "Морские порты, города науки и новые индустрии. Регион, который связывает Россию с Тихим океаном.",
    hero: "hero-primorye.webp",
    heroAlt: "Маяк на побережье Приморского края",
    stats: [
      ["164,7", "тыс. км²", "Площадь территории"],
      ["1 807,5", "тыс. человек", "Население края"],
      ["6", "городов", "Мастер-планы развития"],
    ],
  },
  buryatia: {
    id: "buryatia",
    code: "03",
    eyebrow: "Республика",
    title: (
      <>
        Бурятия<span className="hero-title-dot">.</span>
      </>
    ),
    subtitle:
      "Байкал, города и большие маршруты. Территория, где встречаются культуры и начинается новое развитие.",
    hero: "hero-buryatia.webp",
    heroAlt: "Буддийский дацан в Бурятии — фотография из макета",
    stats: [
      ["351,3", "тыс. км²", "Площадь территории"],
      ["951,3", "тыс. человек", "Население республики"],
      ["2", "города", "Мастер-планы развития"],
    ],
  },
};

export const primoryeCities = [
  {
    id: "vladivostok",
    name: "Владивосток",
    subtitle: "и агломерация",
    tag: "Море · наука · культура",
    description:
      "Владивосток и остров Русский, Артём, Большой Камень. Три связанные территории.",
    illustration: "city-lineart-vladivostok.webp",
    image: "detail-vladivostok.webp",
    crest: "crest-vladivostok.webp",
    title: "Возможности большого города.",
    text: "Экономика, транспорт, наука и туризм объединяют территории агломерации. Единая стратегия связывает городские центры с морским побережьем.",
    themes: [
      ["ship", "Морская экономика"],
      ["social", "Наука и образование"],
      ["tourism", "Туризм"],
    ],
    href: siteHref("vladivostok"),
    cta: "Открыть мастер-план",
  },
  {
    id: "nakhodka",
    name: "Находка",
    tag: "Порт · промышленность",
    description:
      "Крупный портовый и промышленный центр на берегу Японского моря.",
    illustration: "city-lineart-nakhodka.webp",
    image: "city-lineart-nakhodka.webp",
    title: "Город открытых морских путей.",
    text: "Морской порт и промышленность определяют характер Находки. Мастер-план связывает развитие экономики с качеством повседневной городской жизни.",
    themes: [
      ["anchor", "Морской порт"],
      ["factory", "Промышленность"],
      ["housing", "Городская среда"],
    ],
    href: `${officialRoot}/primkrai`,
    external: true,
    cta: "Материалы мастер-плана",
  },
  {
    id: "ussuriysk",
    name: "Уссурийск",
    tag: "Маршруты · агроэкономика",
    description: "Транспортный, аграрный и логистический центр Приморья.",
    illustration: "city-lineart-ussuriysk.webp",
    image: "city-lineart-ussuriysk.webp",
    title: "На пересечении маршрутов.",
    text: "Уссурийск объединяет транспортные связи, аграрную экономику и городскую инфраструктуру. Мастер-план раскрывает потенциал одного из ключевых центров Приморья.",
    themes: [
      ["train", "Транспорт"],
      ["ecology", "Агроэкономика"],
      ["economy", "Логистика"],
    ],
    href: `${officialRoot}/primkrai`,
    external: true,
    cta: "Материалы мастер-плана",
  },
  {
    id: "arsenyev",
    name: "Арсеньев",
    tag: "Индустрии · природа",
    description: "Промышленный город у природных территорий Сихотэ-Алиня.",
    illustration: "city-lineart-arsenyev.webp",
    image: "city-lineart-arsenyev.webp",
    title: "Технологии рядом с природой.",
    text: "Промышленный характер и близость горных ландшафтов создают основу для развития Арсеньева. В центре мастер-плана — город, удобный для жизни и работы.",
    themes: [
      ["factory", "Промышленность"],
      ["ecology", "Природные территории"],
      ["housing", "Комфортная жизнь"],
    ],
    href: `${officialRoot}/primkrai`,
    external: true,
    cta: "Материалы мастер-плана",
  },
];

export const buryatiaCities = [
  {
    id: "ulan-ude",
    name: "Улан-Удэ",
    tag: "Культура · наука · индустрии",
    description:
      "Столица Бурятии, культурный, научный и промышленный центр республики.",
    illustration: "city-lineart-ulan-ude-v2.webp",
    image: "city-ulan-ude.webp",
    crest: "crest-ulan-ude.webp",
    title: "Характер — солнечный.",
    text: "Город в долине Селенги и Уды, где исторические кварталы встречаются с большой промышленностью, а транспортные маршруты связывают Восток и Запад.",
    themes: [
      ["heritage", "Культура"],
      ["train", "Транссиб"],
      ["factory", "Промышленность"],
    ],
    href: "#mission",
    cta: "Открыть миссию города",
    stats: [
      ["436,4", "тыс. человек", "Население города"],
      ["197 / 360", "2024 год", "Индекс городской среды"],
    ],
  },
  {
    id: "severobaikalsk",
    name: "Северобайкальск",
    tag: "Байкал · БАМ · туризм",
    description: "Опорный центр западного БАМа и крупнейший город на Байкале.",
    illustration: "city-lineart-severobaikalsk-v2.webp",
    image: "city-lineart-severobaikalsk-v2.webp",
    crest: "crest-severobaikalsk.webp",
    title: "Вернуть Байкал городу.",
    text: "Связать город с берегом озера, развивать гостеприимство и удобные общественные пространства — основная идея мастер-плана Северобайкальска.",
    themes: [
      ["waves", "Озеро Байкал"],
      ["train", "Байкало-Амурская магистраль"],
      ["tourism", "Гостеприимство"],
    ],
    href: `${officialRoot}/buryatia`,
    external: true,
    cta: "Материалы мастер-плана",
  },
];

export const ulanDirections = [
  {
    id: "life",
    icon: "heritage",
    title: "Центр городской жизни",
    text: "Сильный центр города с общественными пространствами, культурой и повседневными сервисами.",
    image: "concept-square.webp",
    features: [
      "Исторические улицы и кварталы",
      "Общественные пространства",
      "Культура и городские события",
    ],
  },
  {
    id: "mobility",
    icon: "route",
    title: "Транспортная доступность",
    text: "Связанные районы и удобные поездки. Развитие транспортного и логистического каркаса города.",
    image: "concept-mobility.webp",
    features: [
      "Общественный транспорт",
      "Связи между районами",
      "Транспортная инфраструктура",
    ],
  },
  {
    id: "housing",
    icon: "housing",
    title: "Жильё и городская среда",
    text: "Обновление застройки и комплексное развитие территорий с жильём, сервисами и социальной инфраструктурой.",
    image: "concept-buryatia-riverfront.webp",
    features: [
      "Комплексное развитие территорий",
      "Социальная инфраструктура",
      "Комфортные жилые кварталы",
    ],
  },
  {
    id: "ecology",
    icon: "ecology",
    title: "Экологическое благополучие",
    text: "Чистый воздух, чистая вода и зелёный город. Природная среда становится частью повседневной жизни.",
    image: "concept-water.webp",
    features: [
      "Реки и прибрежные территории",
      "Озеленение города",
      "Экологическая инфраструктура",
    ],
  },
];

// Figma Page 12 content only. This is separate from the approved Vladivostok dataset.
// The repeated "Исторический центр" at source numbers 05/06 is represented once.
export const ulanProjectGroups = [
  {
    id: "renewal",
    label: "Реновация и КРТ",
    icon: "housing",
    color: "#9ce1aa",
  },
  {
    id: "new",
    label: "Новые пространства",
    icon: "heritage",
    color: "#92d8ff",
  },
  {
    id: "infrastructure",
    label: "Инфраструктура",
    icon: "transport",
    color: "#d3c0ff",
  },
];
export const ulanProjects = [
  {
    id: "white-swan",
    number: "01",
    title: "КРТ «Белый Лебедь»",
    category: "renewal",
    description: "Жильё и прибрежные общественные пространства.",
    features: [
      "Жилая застройка",
      "Набережная",
      "Фермерский рынок",
      "Трамвайная остановка",
    ],
    anchor: [43, 36],
    image: "concept-waterfront.webp",
  },
  {
    id: "batareyka",
    number: "02",
    title: "КРТ «Батарейка»",
    category: "renewal",
    description:
      "Комплексное развитие прибрежной территории с жилой застройкой, парком и социальной инфраструктурой.",
    features: [
      "Парк и благоустроенная набережная",
      "Пешеходный мост через Уду",
      "Культурный и спортивный центр",
      "Социальная инфраструктура",
      "Жильё по стандарту ДОМ.РФ",
    ],
    anchor: [55, 55],
    image: "concept-buryatia-riverfront.webp",
  },
  {
    id: "prirechnoe",
    number: "03",
    title: "КРТ «Приречное»",
    category: "renewal",
    description: "Новые городские пространства у реки.",
    features: ["Парк", "Пешеходные связи", "Культурный и спортивный центр"],
    anchor: [60, 63],
    image: "concept-park.webp",
  },
  {
    id: "east-gate",
    number: "04",
    title: "КРТ «Восточные ворота»",
    category: "renewal",
    description: "Новый деловой район, мостовой переход и транспортный узел.",
    features: ["Деловая застройка", "Мостовой переход", "Транспортный узел"],
    anchor: [77, 39],
    image: "concept-bridge.webp",
  },
  {
    id: "old-center",
    number: "05",
    title: "Исторический центр",
    category: "renewal",
    description:
      "Ревитализация улиц и развитие культурной и туристической инфраструктуры.",
    features: [
      "Обновление исторических улиц",
      "Культурное наследие",
      "Туристическая инфраструктура",
    ],
    anchor: [65, 48],
    image: "concept-heritage.webp",
  },
  {
    id: "green-bridges",
    number: "07",
    title: "Набережная «Зелёные мосты»",
    category: "new",
    description: "Первый этап набережной вдоль реки Уды.",
    features: [
      "Прибрежное общественное пространство",
      "Пешеходные маршруты",
      "Связь города с рекой",
    ],
    anchor: [69, 59],
    image: "concept-waterfront.webp",
  },
  {
    id: "museum",
    number: "08",
    title: "Национальный музей Восточной Азии",
    category: "new",
    description: "Музейный комплекс, посвящённый культуре региона.",
    features: [
      "Музейные пространства",
      "Культурная инфраструктура",
      "Образовательные программы",
    ],
    anchor: [64, 38],
    image: "concept-heritage.webp",
  },
  {
    id: "campus",
    number: "09",
    title: "Межвузовский кампус Россия — Монголия",
    category: "new",
    description: "Образовательный и научный центр международного уровня.",
    features: [
      "Образовательная среда",
      "Научные пространства",
      "Международное сотрудничество",
    ],
    anchor: [48, 69],
    image: "concept-innovation.webp",
  },
  {
    id: "baikal-theatre",
    number: "10",
    title: "Театр «Байкал»",
    category: "new",
    description: "Современное пространство для театрального искусства.",
    features: [
      "Театральная инфраструктура",
      "Культурные события",
      "Общественное пространство",
    ],
    anchor: [52, 44],
    image: "concept-heritage.webp",
  },
  {
    id: "selenga-bridge",
    number: "11",
    title: "Селенгинский мост",
    category: "infrastructure",
    description: "Новый мостовой переход через реку Селенгу.",
    features: [
      "Мостовой переход",
      "Связи между районами",
      "Транспортная доступность",
    ],
    anchor: [39, 61],
    image: "concept-bridge.webp",
  },
  {
    id: "tram",
    number: "12",
    title: "Развитие трамвайной сети",
    category: "infrastructure",
    description: "Новые линии и современные трамваи.",
    features: [
      "Развитие маршрутной сети",
      "Обновление подвижного состава",
      "Удобные ежедневные поездки",
    ],
    anchor: [75, 71],
    image: "concept-mobility.webp",
  },
];
