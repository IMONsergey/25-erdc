import { isupSnapshot } from "./isupSnapshot.js";
import { industries, mapObjects, plans, stages } from "./mockData.js";
import { normalizeIsupFeatureCollection } from "./isupAdapter.js";

const asset = (name) => new URL(`../assets/${name}`, document.baseURI).href;

const dictionaryCache = new Map();
const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true },
    );
  });

export class MapDataProvider {
  async getDictionaries() {
    throw new Error("getDictionaries is not implemented");
  }

  async getObjects() {
    throw new Error("getObjects is not implemented");
  }
}

export class MockMapDataProvider extends MapDataProvider {
  async getDictionaries({ signal } = {}) {
    if (!dictionaryCache.has("isup-snapshot")) {
      await wait(260, signal);
      dictionaryCache.set("isup-snapshot", {
        plans: isupSnapshot.plans.length ? isupSnapshot.plans : plans,
        industries: isupSnapshot.industries.length ? isupSnapshot.industries : industries,
        stages: isupSnapshot.stages.length ? isupSnapshot.stages : stages,
      });
    }
    return dictionaryCache.get("isup-snapshot");
  }

  async getObjects({ filters, scenario = "data", signal } = {}) {
    await wait(420, signal);
    if (scenario === "error") {
      throw new Error("Mock API returned 503 for diagnostics");
    }
    if (scenario === "empty") return [];

    const source = isupSnapshot.objects.length ? isupSnapshot.objects : mapObjects;
    const query = filters.query.trim().toLowerCase();
    return source.filter((item) => {
      const matchesPlan = filters.planIds.has(item.planId);
      const matchesStage = filters.stageIds.has(item.stageId);
      const matchesIndustry = filters.industryIds.has(item.industryId);
      const searchable = `${item.title} ${item.address} ${item.description}`.toLowerCase();
      return matchesPlan && matchesStage && matchesIndustry && (!query || searchable.includes(query));
    }).map((item) => ({
      ...item,
      image: item.image ?? imageForObject(item),
      budget: formatBudget(item.budget),
      deadline: item.deadline || "срок уточняется",
    }));
  }
}

export class RemoteMapDataProvider extends MapDataProvider {
  constructor({ baseUrl = "/api/geometry/public/showcase", wfsUrl = "https://geo-server.erdc.ru/geoserver/isup/ows" } = {}) {
    super();
    this.baseUrl = baseUrl;
    this.wfsUrl = wfsUrl;
  }

  async getDictionaries({ signal } = {}) {
    const [remotePlans, remoteIndustries] = await Promise.all([
      fetch(`${this.baseUrl}/dkps`, { signal }).then((response) => response.json()),
      fetch(`${this.baseUrl}/industries`, { signal }).then((response) => response.json()),
    ]);
    return {
      plans: remotePlans.map((item) => ({ id: item.id, label: item.name, count: 0, center: [131.92, 43.18], zoom: 11 })),
      industries: remoteIndustries.map((item) => ({ id: item.id, label: item.name, icon: "○", color: "#1c97d9" })),
      stages,
    };
  }

  async getObjects({ filters, signal } = {}) {
    const planId = [...filters.planIds][0];
    const params = new URLSearchParams({
      service: "wfs",
      version: "2.0.0",
      request: "GetFeature",
      typeName: "isup:object_showcase_search",
      outputFormat: "application/json",
      count: "200",
      srsName: "EPSG:4326",
      viewparams: `q:${filters.query}`,
    });
    if (planId) params.set("CQL_FILTER", `dkp_id = '${planId}'`);
    const response = await fetch(`${this.wfsUrl}?${params}`, { signal });
    return normalizeIsupFeatureCollection(await response.json());
  }
}

export class ProxyMapDataProvider extends MapDataProvider {
  constructor({ endpoint = "/api/map-lab" } = {}) {
    super();
    this.endpoint = endpoint;
  }

  async getDictionaries({ signal } = {}) {
    return fetch(`${this.endpoint}/dictionaries`, { signal }).then((response) => response.json());
  }

  async getObjects({ filters, signal } = {}) {
    return fetch(`${this.endpoint}/objects`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: filters.query,
        planIds: [...filters.planIds],
        stageIds: [...filters.stageIds],
        industryIds: [...filters.industryIds],
        bbox: filters.bbox,
      }),
      signal,
    }).then((response) => response.json());
  }
}

export function createMapDataProvider(mode) {
  if (mode === "remote") return new RemoteMapDataProvider();
  if (mode === "proxy") return new ProxyMapDataProvider();
  return new MockMapDataProvider();
}

function imageForObject(item) {
  const source = `${item.industryName ?? ""} ${item.title ?? ""}`.toLowerCase();
  if (source.includes("транспорт")) return asset("city-vladivostok.webp");
  if (source.includes("жиль")) return asset("project-kungasny.webp");
  if (source.includes("образ")) return asset("detail-vladivostok.webp");
  if (source.includes("культур") || source.includes("спорт")) return asset("project-ulyss.webp");
  if (source.includes("тур")) return asset("project-firsova.webp");
  return asset("mission-map.webp");
}

function formatBudget(value) {
  if (typeof value === "string") return value;
  if (!Number.isFinite(value) || value <= 0) return "не указан";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} млрд ₽`;
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)} млн ₽`;
  return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}
