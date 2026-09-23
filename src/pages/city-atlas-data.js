import { normalize } from "../portal/data.js";

export const cityDirections = [
  { id: "housing", title: "Жильё и город", icon: "housing", color: "#79dffa" },
  { id: "social", title: "Образование и культура", icon: "social", color: "#bbcbff" },
  { id: "health", title: "Здоровье и спорт", icon: "health", color: "#f5c5b2" },
  { id: "transport", title: "Транспорт", icon: "transport", color: "#ffd09c" },
  { id: "engineering", title: "Инфраструктура", icon: "engineering", color: "#a3dbed" },
  { id: "ecology", title: "Парки и набережные", icon: "ecology", color: "#a0e3b3" },
  { id: "tourism", title: "Туризм", icon: "tourism", color: "#cbb7f8" },
  { id: "economy", title: "Экономика", icon: "economy", color: "#fae5ad" },
  { id: "city", title: "Развитие города", icon: "spark", color: "#b5e4e5" },
];

// Editorial navigation only. The original project records and their metrics
// remain unchanged; no project coordinates are inferred from an illustration.
export function cityDirection(project) {
  const title = normalize(project.title);
  if (/комплексное развитие территор|ревитализаци|редевелопмент|центр городской жизни/.test(title)) return "housing";
  if (/жил[а-я]* (застрой|комплекс|дом)|жилищ|жиль|микрорайон|\bжк\b|жк «|переселени/.test(title) && !/водоснаб|водоотвед|теплоснаб|школ|детск|дорог/.test(title)) return "housing";
  if (/промышленн|индустриальн|предприят|производств|завод|бизнес|мсп|торгов|рынк|ярмар|семеновод|селекци|агротех|склад|швейн|конгресс|креативн/.test(title) && !/жил|школ|кампус|образов|очистн|порт/.test(title)) return "economy";
  if (/туризм|турист|курорт|гостиниц|глэмпинг/.test(title)) return "tourism";
  if (/больниц|поликлиник|здравоохран|лечеб|реабилит|родильн|онколог|спортив|физкультур|стадион|катк|бассейн|арен[аы]|трамплин|оздоров|медицин/.test(title)) return "health";
  if (/школ|детск[а-я]* сад|детей|образов|научн|кампус|музе|культур|теат|библиотек|молодеж|университет|техникум|сош|лице|доу|загс|колледж|клуб|искусств/.test(title)) return "social";
  if (/транспорт|трамва|троллейб|пассажир/.test(title)) return "transport";
  if (/водоснаб|водоотвед|водопровод|теплов|теплоснаб|котельн|канализац|очистн|газиф|электр|энерг|ливнев|затоплен|дамб|инженер|берегоукреп/.test(title) && !/набережн/.test(title)) return "engineering";
  if (/транспорт|дорог|путепровод|вокзал|аэропорт|аэродром|авиа|взлет|мост|порт|автобус|трамва|троллейб|магистрал|светофор|логистик|причал/.test(title)) return "transport";
  if (/парк|сквер|набереж|благоустрой|озер|площади|пляж|эколог|тко|отход|зелен|двор|берег/.test(title)) return "ecology";
  if (/освещен|проектно-изыск|цифров|информацион/.test(title)) return "engineering";
  return "city";
}

export const projectWord = n => n % 100 >= 11 && n % 100 <= 14 ? "проектов" : n % 10 === 1 ? "проект" : n % 10 >= 2 && n % 10 <= 4 ? "проекта" : "проектов";
