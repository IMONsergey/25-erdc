// Navigation owns territories; source project records remain unchanged.
export const agglomerations = {
  vladivostok: { name: 'Владивостокская агломерация', members: ['vladivostok', 'artem', 'bolshoy-kamen'] },
  'petropavlovsk-kamchatsky': { name: 'Петропавловск-Камчатская агломерация', members: ['petropavlovsk-kamchatsky', 'elizovo'] },
  'yuzhno-sakhalinsk': { name: 'Южно-Сахалинская агломерация', members: ['yuzhno-sakhalinsk', 'korsakov'] },
  anadyr: { name: 'Анадырская агломерация', members: ['anadyr', 'ugolnye-kopi', 'tavayvaam'] },
};
export const memberNames = {artem:'Артём',anadyr:'Анадырь','yuzhno-sakhalinsk':'Южно-Сахалинск',elizovo:'Елизово',korsakov:'Корсаков','ugolnye-kopi':'Угольные Копи',tavayvaam:'Тавайваам'};
export const memberDescriptions = {
  elizovo:'Воздушные ворота Камчатки. Город соединяет международный аэропорт, жилые территории и маршруты к природным достопримечательностям.',
  korsakov:'Морские ворота юга Сахалина. Порт и городская среда связывают побережье с Южно-Сахалинском.',
  'ugolnye-kopi':'Территория аэропорта на другом берегу Анадырского лимана. Мастер-план объединяет развитие транспорта и повседневных городских сервисов.',
  tavayvaam:'Поселение на побережье рядом с Анадырем. В мастер-плане — благоустройство береговой линии и пространства у центра культуры.',
};
export const parentTerritory = id => ['artem','bolshoy-kamen'].includes(id) ? 'vladivostok' : id;
export const territoryName = city => agglomerations[city.id]?.name || memberNames[city.id] || city.name;
export const territoryPath = id => parentTerritory(id)==='vladivostok' ? 'vladivostok' : `cities/${id}`;
export const memberForProject = p => {
  if(p.city==='yuzhno-sakhalinsk' && /Корсаков/i.test(p.title)) return 'korsakov';
  if(p.city==='petropavlovsk-kamchatsky' && /Елизов/i.test(p.title)) return 'elizovo';
  if(p.city==='anadyr' && /Угольные Копи/i.test(p.title)) return 'ugolnye-kopi';
  if(p.city==='anadyr' && /Тавайваам/i.test(p.title)) return 'tavayvaam';
  return p.city;
};
export const projectDestination = p => p.city && p.city!=='vladivostok'
  ? `${territoryPath(p.city)}/?city=${memberForProject(p)}&project=${p.id}#projects`
  : p.city==='vladivostok' ? `projects/?city=vladivostok&project=${p.id}` : `${p.region==='primkrai'?'primorye':p.region}/?object=${p.id}#programs`;
