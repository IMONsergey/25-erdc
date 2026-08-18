export const asset = (name) => new URL(`${import.meta.env.BASE_URL}assets/${name}`, document.baseURI).href;

export const cities = [
  {
    id: "vladivostok",
    name: "Владивосток и остров Русский",
    crest: "crest-vladivostok.webp",
    photo: "city-vladivostok.webp",
    alt: "Побережье Владивостока",
    description: "Морской, административный, научный, образовательный и туристический центр.",
  },
  {
    id: "artem",
    name: "Артем",
    crest: "crest-artem.webp",
    photo: "city-artem.webp",
    alt: "Панорама Артема",
    description: "Город аэропорта, промышленности и новых жилых территорий.",
  },
  {
    id: "bolshoy-kamen",
    name: "Большой камень",
    crest: "crest-bolshoy-kamen.webp",
    photo: "city-bolshoy-kamen.webp",
    alt: "Побережье Большого Камня",
    description: "Центр судостроения, производства и развития морской промышленности.",
  },
];

export const categories = [
  { id: "housing", label: "Жильё и деловая застройка", icon: "icon-category-housing.svg" },
  { id: "social", label: "Социальная инфраструктура", icon: "icon-category-social.svg" },
  { id: "transport", label: "Транспорт и мобильность", icon: "icon-category-transport.svg" },
  { id: "engineering", label: "Инженерная инфраструктура", icon: "icon-category-engineering.svg" },
  { id: "ecology", label: "Рекреация и экология", icon: "icon-category-ecology.svg" },
  { id: "tourism", label: "Туризм", icon: "icon-category-tourism.svg" },
];

export const projects = [
  { id: "kungasny", title: "КРТ в районе мыса Кунгасного", short: "Морской деловой центр на месте нефтебазы.", image: "project-kungasny.webp", complete: true },
  { id: "kaluzina", title: "КРТ мыс Калузина", short: "Новый район с жилой и деловой застройкой, намывом территории и выходом к морю.", image: "project-kaluzina.webp" },
  { id: "firsova", title: "КРТ мыс Фирсова", short: "Морской деловой центр на месте нефтебазы.", image: "project-firsova.webp" },
  { id: "ulyss", title: "КРТ бухта Улисс", short: "Развитие прибрежных территорий и парковая зона вдоль бухты.", image: "project-ulyss.webp" },
  { id: "neftebaza", title: "ЦДР Нефтебаза", short: "Преобразование территории в многофункциональный деловой район.", image: "project-neftebaza.webp" },
];
