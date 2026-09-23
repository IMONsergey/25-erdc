import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { isupSnapshot } from "../src/map-lab/isupSnapshot.js";

const catalog = JSON.parse(await readFile("src/content/catalog.json", "utf8"));
const cityById = Object.fromEntries(catalog.cities.map(c => [c.id, c]));
const planCities = {
  "Анадырская городская агломерация": "anadyr",
  "Арсеньев": "arsenyev", "Белогорск": "belogorsk", "Биробиджан": "birobidzhan",
  "Благовещенск": "blagoveshchensk", "Большой Камень": "bolshoy-kamen",
  "Владивостокская городская агломерация": "vladivostok",
  "Комсомольск-на-Амуре": "komsomolsk", "Краснокаменск": "krasnokamensk",
  "Магадан": "magadan-city", "Находка": "nakhodka",
  "Нерюнгринская городская агломерация": "neryungri",
  "Петропавловск-Камчатский": "petropavlovsk-kamchatsky",
  "Северобайкальск": "severobaykalsk", "Тында": "tynda",
  "Улан-Удэнская городская агломерации": "ulan-ude", "Уссурийск": "ussuriysk",
  "Хабаровская городская агломерация": "khabarovsk",
  "Циолковский-Свободный": "svobodny", "Чита": "chita",
  "Южно-Сахалинская городская агломерация": "yuzhno-sakhalinsk",
  "Якутская городская агломерация": "yakutsk",
};
const industryCategory = {
  "Жилье и среда": "housing", "Безопасность": "social", "Здравоохранение": "social",
  "Культура и спорт": "social", "Образование и наука": "social", "Социальная защита": "social",
  "Транспорт": "transport", "Инфраструктура": "engineering", "Связь и IT": "engineering",
  "Экология": "ecology", "Туризм": "tourism", "Экономика и производство": "economy",
};
const clean = (s = "") => String(s).replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const normalized = s => clean(s).toLowerCase().replaceAll("ё", "е").replace(/[^\p{L}\d]/gu, "");
const index = {};
let total = 0;
await mkdir("public/content/atlas", { recursive: true });
await copyFile("src/content/atlas-land.json", "public/content/atlas/land.json");
for (const region of catalog.regions) {
  const plans = isupSnapshot.plans.filter(p => cityById[planCities[p.label]]?.region === region.id).map(p => {
    const city = cityById[planCities[p.label]];
    return { id: p.id, cityId: city.id, cityIds: city.id === "vladivostok" ? [city.id, "artem"] : [city.id], name: city.id === "vladivostok" ? "Владивосток и Артём" : city.name, center: p.center, image: city.image };
  });
  const ids = new Set(plans.map(p => p.id));
  const objects = isupSnapshot.objects.filter(o => ids.has(o.planId)).map(o => {
    const plan = plans.find(p => p.id === o.planId);
    const matches = catalog.projects.filter(p => p.region === region.id && normalized(p.title) === normalized(o.title));
    const match = matches.length === 1 ? matches[0] : null;
    // A fleet procurement programme has no single land location. Its supplied
    // marker is far outside Magadan; retain its record, not that misleading point.
    const coordinates = o.id === "89c29557-7303-44ae-acef-a9b3e0412455" ? null : o.coordinates;
    assert.ok(!coordinates || coordinates.length === 2 && coordinates.every(Number.isFinite));
    assert.ok(industryCategory[o.industryName], o.industryName);
    return { id: o.id, planId: o.planId, cityId: plan.cityId, title: clean(o.title), description: clean(o.description), address: clean(o.address), category: industryCategory[o.industryName], industry: o.industryName, stage: o.stageId, deadline: o.deadline || null, budget: Number.isFinite(o.budget) && o.budget > 0 ? o.budget : null, coordinates, projectId: match?.id || null, images: match?.images || [] };
  });
  assert.ok(plans.length && objects.length, `No atlas data for ${region.name}`);
  for (const cityId of region.cities) assert.ok(plans.some(p => p.cityIds.includes(cityId)), `City is missing: ${cityId}`);
  const mappedCount = objects.filter(o => o.coordinates).length;
  index[region.id] = { count: objects.length, mappedCount, plans, categories: Object.fromEntries(Object.values(industryCategory).map(id => [id, objects.filter(o => o.category === id).length])) };
  await writeFile(`public/content/atlas/${region.id}.json`, JSON.stringify({ region: region.id, sourceDate: isupSnapshot.generatedAt, plans, objects }));
  total += objects.length;
}
assert.equal(total, isupSnapshot.objects.length, "Atlas records were lost or assigned twice");
await writeFile("src/content/atlas-regions.json", JSON.stringify(index));
console.log(`Prepared ${Object.keys(index).length} regional atlases, ${total} objects, with original coordinates and region ownership.`);
