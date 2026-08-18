const stageMap = {
  PLANNED: "planned",
  PREP: "prep",
  PIR: "design",
  SMR: "build",
  OPERATION: "operation",
};

export function normalizeIsupFeature(feature) {
  const properties = feature?.properties ?? {};
  return {
    id: properties.obj_id ?? feature.id,
    planId: properties.dkp_key ?? properties.dkp_id,
    title: properties.obj_name ?? "Объект без названия",
    address: properties.obj_description ?? "",
    description: properties.activity_name ?? properties.obj_description ?? "",
    industryId: properties.activity_industry_id ?? properties.activity_industry_key ?? "infrastructure",
    stageId: detectStage(properties),
    deadline: properties.obj_plan_date_end ? `до ${properties.obj_plan_date_end}` : "",
    budget: properties.budget_approved_total ? `${properties.budget_approved_total} ₽` : "",
    area: properties.location_source_type ?? "",
    coordinates: toLonLat(feature?.geometry?.coordinates),
    image: null,
    updatedAt: properties.updated_at ?? null,
    source: "isup-wfs",
  };
}

export function normalizeIsupFeatureCollection(collection) {
  return (collection?.features ?? []).map(normalizeIsupFeature).filter((item) => item.id && item.coordinates);
}

function detectStage(properties) {
  const currentKey = String(properties.obj_current_stage_key ?? "").toUpperCase();
  if (currentKey === "OPERATION") return "operation";
  if (currentKey === "SMR") return "build";
  if (currentKey === "PIR") return "design";
  if (currentKey === "DPT" || currentKey === "PREP") return "prep";
  if (String(properties.obj_status_category ?? "").toUpperCase() === "DONE") return "operation";
  return stageMap[properties.obj_status_category] ?? "planned";
}

function toLonLat(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return null;
  return coordinates;
}
