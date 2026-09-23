import { normalize } from "./data.js";

// Territory filters match explicit mentions in article titles/excerpts.
// They do not assign a publisher's region to a national news article.
const mentions = {
  primkrai:/примор|владивосток|арт[её]м|находк|уссурий|арсеньев|большо[йм] кам/, khabkrai:/хабаров|комсомольск-на-амуре/,
  kamchatka:/камчат/, buryatia:/бурят|улан-уд|северобайкаль/,
  yakutia:/якут|нерюнг|республик[аи] саха/, chukot:/чукот|анадыр/,
  zabaikal:/забайкал|(?:^|[^а-я])чит[аеуы](?:[^а-я]|$)|читинск|краснокамен/, amurskaya:/амурск[а-я]* област|благовещен|белогорск|свободн[ыо]|тынд/,
  sakhalin:/сахалин|корсаков/, eao:/еврейск|биробиджан/, magadan:/магадан/,
};
export function filterNews(items,{query="",year="",territory="",sort="newest"}={}) {
  return items.filter(n=>{
    const text=normalize(n.title+" "+n.excerpt);
    return (!year||n.date.startsWith(year))&&(!territory||mentions[territory]?.test(text))&&text.includes(normalize(query.trim()));
  }).sort((a,b)=>sort==="oldest"?a.date.localeCompare(b.date):b.date.localeCompare(a.date));
}
