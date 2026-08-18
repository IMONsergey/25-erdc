# API-инвентаризация карты ИСУП

Дата наблюдения: 18 августа 2026. Все примеры ниже очищены от credentials, cookies и токенов.

## Frontend assets

- `GET https://isup.erdc.ru/map/map`
  Назначение: HTML entry, редиректит/открывает SPA на `/map/`.
  Cache: `no-store, no-cache, must-revalidate`.

- `GET https://isup.erdc.ru/map/assets/index-*.js`
  Назначение: основной Vue/Vue Router bundle.
  Cache: `max-age=2592000, public`.

- `GET https://isup.erdc.ru/map/assets/HomeView-*.js`
  Назначение: карта, OpenLayers, providers, фильтры, sidebar.
  Cache: `max-age=2592000, public`.

## Справочники

- `GET https://isup.erdc.ru/api/geometry/public/showcase/dkps`
  Назначение: список мастер-планов.
  Ответ: массив `{ id: string, name: string }`.
  CORS: в браузерном ответе не был виден `access-control-allow-origin`.
  Cache: `no-cache, no-store, max-age=0, must-revalidate`.

- `GET https://isup.erdc.ru/api/geometry/public/showcase/industries`
  Назначение: отраслевые классификаторы.
  Ответ: массив `{ id: string, name: string }`.
  CORS: в браузерном ответе не был виден `access-control-allow-origin`.
  Cache: `no-cache, no-store, max-age=0, must-revalidate`.

- `GET https://isup.erdc.ru/api/geometry/public/showcase/obj-count/by-dkp`
  Назначение: количество объектов по мастер-планам.
  Ответ: массив `{ id: string, name: string, key: string, count: number }`.

- `GET https://isup.erdc.ru/api/geometry/public/showcase/obj-count/by-dkp/{dkpId}/by-industry`
  Назначение: количество объектов выбранного мастер-плана по отраслям.
  Ответ: массив `{ id: string, name: string, key: string, count: number }`.

## Геоданные WFS

- `GET https://geo-server.erdc.ru/geoserver/isup/ows`
  Назначение: точки объектов и поисковая выдача.
  Формат: GeoJSON FeatureCollection.
  CORS: `access-control-allow-origin: *` наблюдался для WFS.
  Авторизация: отдельный WFS-запрос из Node успешно прошёл без Basic Auth; отправка Basic Auth к GeoServer дала `401`, поэтому не нужно смешивать credentials основного сайта и GeoServer.

Основные query-параметры:

- `service=wfs`
- `version=2.0.0` или `1.1.0`
- `request=GetFeature`
- `typeName=isup:object_showcase_point`
- `typeName=isup:object_showcase_search`
- `outputFormat=application/json`
- `count=5`, `count=20`, `count=10000`
- `srsName=EPSG:3857` или `srsName=EPSG:4326`
- `CQL_FILTER=dkp_id = '{dkpId}'`
- `sortBy=updated_at D`
- `sortBy=activity_name`
- `propertyName=obj_stage_prep_status,...,activity_industry_id`
- `viewparams=q:{searchQuery}`

Схема feature properties, наблюдаемые поля:

- `obj_id`, `obj_key`, `obj_name`, `obj_description`
- `obj_status_category`
- `obj_plan_date_start`, `obj_plan_date_end`
- `obj_projected_date_start`, `obj_projected_date_end`
- `activity_id`, `activity_name`, `activity_city`, `activity_region`
- `activity_industry`, `activity_industry_id`, `activity_industry_icon`
- `activity_responsible_org`
- `dkp_id`, `dkp_key`, `dkp_name`
- `budget_dkp_total`, `budget_approved_total`, `budget_cost_size`
- `location_source_type`, `location_geometry_readiness`
- `obj_stage_prep_status`, `obj_stage_pir_status`, `obj_stage_smr_status`, `obj_stage_operation_status`
- `obj_current_stage_id`, `obj_current_stage_name`, `obj_current_stage_key`

Для прототипа стадия объекта нормализуется по `obj_current_stage_key`: `PIR` -> проектирование, `SMR` -> строительство, `OPERATION` -> введён в эксплуатацию, `DPT/PREP` -> подготовительные работы. Status-поля стадий используются как дополнительные диагностические признаки, потому что они могут быть непустыми одновременно у нескольких этапов.

Текущий snapshot для `/map-lab/`:

- мастер-планы: 22;
- отрасли: 12;
- WFS-точки: 1753;
- Владивостокская городская агломерация: 277 объектов.

## WMS-тайлы

- `GET https://geo-server.erdc.ru/geoserver/erdc/wms`
  Назначение: raster WMS-подложка.
  Параметры: `REQUEST=GetMap`, `SERVICE=WMS`, `VERSION=1.3.0`, `FORMAT=image/png`, `TRANSPARENT=TRUE`, `layers=erdc:azrf_dfo.osm.wms`, `WIDTH=256`, `HEIGHT=256`, `CRS=EPSG:3857`, `BBOX=...`.

## Карточки объектов

В наблюдаемом публичном сценарии карточки в sidebar строятся из WFS properties. Отдельный endpoint карточки объекта в сетевом прогоне не был подтверждён. Возможны дополнительные запросы для изображений/альбомов при глубоком открытии объекта, но они не фиксировались как стабильный контракт.

## CORS и интеграционные риски

GeoServer WFS допускает cross-origin чтение (`*`), но основной `isup.erdc.ru/api/geometry/public/showcase/*` в наблюдаемом ответе не отдавал явный CORS allow-origin. Поэтому прямой live-режим с GitHub Pages может упереться в CORS для справочников, даже если WFS-точки читаются напрямую.

## Ошибки и кэширование

API справочников отдаёт no-cache/no-store. Static frontend assets кэшируются на 30 дней. WMS-тайлы в наблюдении приходили как `image/png`; явная CORS/cache-политика для них в playwright-снимке не была зафиксирована.
