import catalog from "../content/catalog.json";
import news from "../content/news-index.json";
import mediaIndex from "../content/media.json";
import { asset } from "../data.js";
export const { regions, cities, projects, quarter, snapshotDate } = catalog;
export { news };
export const regionById = Object.fromEntries(regions.map((r) => [r.id, r]));
export const cityById = Object.fromEntries(cities.map((c) => [c.id, c]));
export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
export const media = (url) =>
  !url
    ? ""
    : mediaIndex[url]
      ? asset(mediaIndex[url])
      : url.startsWith("http")
        ? url
        : asset(url);
export const regionPath = (r) => (r.id === "primkrai" ? "primorye" : r.id);
export const cityPath = (c) =>
  c.id === "vladivostok" ? "vladivostok" : `cities/${c.id}`;
export const dateText = (date) =>
  new Date(date + "T12:00:00Z").toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
export const programNames = {
  masterplan: "Мастер-план",
  subsidy: "Президентская субсидия",
  improvement: "Благоустройство",
};
export const normalize = (text) =>
  text.toLocaleLowerCase("ru").replaceAll("ё", "е");
export const regionShort = {
  primkrai: "Приморье",
  khabkrai: "Хабаровский край",
  kamchatka: "Камчатка",
  buryatia: "Бурятия",
  yakutia: "Якутия",
  chukot: "Чукотка",
  zabaikal: "Забайкалье",
  amurskaya: "Амурская область",
  sakhalin: "Сахалин",
  eao: "Еврейская АО",
  magadan: "Магаданская область",
};
export const regionMood = {
  primkrai: "На берегу Тихого океана",
  khabkrai: "Города на Амуре",
  kamchatka: "Между вулканами и океаном",
  buryatia: "От Байкала к новым горизонтам",
  yakutia: "Масштаб северного будущего",
  chukot: "На краю двух океанов",
  zabaikal: "На пересечении больших путей",
  amurskaya: "Вдоль реки, соединяющей страны",
  sakhalin: "Острова больших возможностей",
  eao: "Природа. Культура. Город.",
  magadan: "На побережье Охотского моря",
};
