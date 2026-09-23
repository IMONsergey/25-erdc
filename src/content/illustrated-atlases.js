// Pins select whole territories. Image anchors are never geographic coordinates.
const scene = (id, anchors) => ({ image: `atlas-region-${id}.webp`, anchors });
export const regionalScenes = {
  primkrai: scene("primkrai", { vladivostok: [59,57], "bolshoy-kamen": [70,51], nakhodka: [86,66], ussuriysk: [48,41], arsenyev: [44,25] }),
  khabkrai: scene("khabkrai", { khabarovsk: [68,62], komsomolsk: [78,25] }),
  kamchatka: scene("kamchatka", { "petropavlovsk-kamchatsky": [76,48] }),
  buryatia: scene("buryatia", { "ulan-ude": [77,67], severobaykalsk: [65,28] }),
  yakutia: scene("yakutia", { yakutsk: [77,28], neryungri: [49,78] }),
  chukot: scene("chukot", { anadyr: [67,50] }),
  zabaikal: scene("zabaikal", { chita: [62,32], krasnokamensk: [81,68] }),
  amurskaya: scene("amurskaya", { blagoveshchensk: [59,61], belogorsk: [80,50], svobodny: [55,36], tynda: [69,16] }),
  sakhalin: scene("sakhalin", { "yuzhno-sakhalinsk": [68,40] }),
  eao: scene("eao", { birobidzhan: [68,48] }),
  magadan: scene("magadan", { "magadan-city": [65,50] }),
};
export const cityScenes = {
  vladivostok: { image: "atlas-vladivostok.webp", anchors: { vladivostok: [64,34] } },
  "ulan-ude": { image: "atlas-ulan-ude.webp", anchors: { "ulan-ude": [65,48] } },
};
