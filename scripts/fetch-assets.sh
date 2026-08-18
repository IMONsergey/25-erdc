#!/usr/bin/env bash
set -euo pipefail

mkdir -p assets assets/fonts

download() {
  local target="$1"
  local url="$2"
  if [[ -s "assets/$target" ]] && ! head -c 64 "assets/$target" | grep -qi '<html'; then
    return
  fi
  curl --fail --location --retry 3 --silent --show-error "$url" --output "assets/$target"
  if [[ ! -s "assets/$target" ]] || head -c 64 "assets/$target" | grep -qi '<html'; then
    echo "Asset download failed: $target" >&2
    exit 1
  fi
}

download_raster() {
  local target="$1"
  local url="$2"
  local width="$3"
  if [[ -f assets/.webp-v2 && -s "assets/$target" ]]; then
    return
  fi
  local source_file
  source_file="$(mktemp)"
  curl --fail --location --retry 3 --silent --show-error "$url" --output "$source_file"
  if head -c 64 "$source_file" | grep -qi '<html'; then
    echo "Raster download failed: $target" >&2
    rm -f "$source_file"
    exit 1
  fi
  if [[ "$target" == crest-* || "$target" == project-marker.webp ]]; then
    cwebp -quiet -mt -lossless -z 9 -resize "$width" 0 "$source_file" -o "assets/$target"
  else
    cwebp -quiet -mt -m 6 -q 84 -resize "$width" 0 "$source_file" -o "assets/$target"
  fi
  rm -f "$source_file"
}

download_raster hero-vladivostok.webp "https://www.figma.com/api/mcp/asset/581c318f-0915-4ac0-859b-5b0210a50993.png" 1920
download_raster crest-vladivostok.webp "https://www.figma.com/api/mcp/asset/8716c996-05eb-43f6-886b-96f662357d11.png" 240
download_raster city-vladivostok.webp "https://www.figma.com/api/mcp/asset/3742721b-4fcc-409d-a99d-38eb66e0d8c3.png" 1200
download_raster crest-artem.webp "https://www.figma.com/api/mcp/asset/d27884df-8a07-4735-ab62-ac3cb3316afe.png" 240
download_raster city-artem.webp "https://www.figma.com/api/mcp/asset/59bed68f-7004-48ba-b3b4-da1ecd66c629.png" 1200
download_raster crest-bolshoy-kamen.webp "https://www.figma.com/api/mcp/asset/39c2df7b-d1a9-495e-ad7a-b41848418fce.png" 240
download_raster city-bolshoy-kamen.webp "https://www.figma.com/api/mcp/asset/d26ce632-f5c9-41bb-9999-22139d58aefa.png" 1200
download_raster detail-vladivostok.webp "https://www.figma.com/api/mcp/asset/e8138885-08a8-459a-acb2-8f49c6793051.png" 1800
download_raster mission-map.webp "https://www.figma.com/api/mcp/asset/2346c3ba-304f-4623-ae32-d33988aec8cd.png" 1200
download_raster mission-city.webp "https://www.figma.com/api/mcp/asset/079d7de1-54ef-4390-9d7b-44b8c456215a.png" 1200
download_raster project-kungasny.webp "https://www.figma.com/api/mcp/asset/d9c5757f-0444-452c-84a8-9e2a32f56204.png" 1000
download_raster project-kaluzina.webp "https://www.figma.com/api/mcp/asset/27d9b084-91e9-4437-b878-ba8268435fff.png" 1000
download_raster project-firsova.webp "https://www.figma.com/api/mcp/asset/5fc6b72a-f606-4cba-8dc3-d5e3d6418907.png" 1000
download_raster project-ulyss.webp "https://www.figma.com/api/mcp/asset/00088972-25b9-45af-99d9-37190a56c6aa.png" 1000
download_raster project-neftebaza.webp "https://www.figma.com/api/mcp/asset/04cae2d8-b194-4ce4-9f37-40d9e15d2a18.png" 1000
download_raster projects-map.webp "https://www.figma.com/api/mcp/asset/8a1cf980-50f8-492b-b150-2ea8a9c4b186.png" 1800
download_raster project-marker.webp "https://www.figma.com/api/mcp/asset/3846b6b7-ffd4-40b0-bec8-c74af01a0959.png" 300
download background-mask.svg "https://www.figma.com/api/mcp/asset/44e1527b-e1eb-4dd9-8a9e-b5fb04a3ce39.svg"
download hero-mask.svg "https://www.figma.com/api/mcp/asset/3f80fddc-120e-4c9b-835d-ce546729f17c.svg"
download icon-scroll.svg "https://www.figma.com/api/mcp/asset/1fa9a37b-1d75-4045-a6e6-e3f87ef9bebc.svg"
download icon-select-city.svg "https://www.figma.com/api/mcp/asset/15e560f1-cf08-475a-a44e-3315852f5eb2.svg"
download radio-selected.svg "https://www.figma.com/api/mcp/asset/93848d4f-c505-445f-8094-caa8025f5971.svg"
download radio-empty.svg "https://www.figma.com/api/mcp/asset/53771546-2403-4f98-adf3-bb8cdbbda494.svg"
download divider.svg "https://www.figma.com/api/mcp/asset/16c85f8c-7f7e-4e9a-b34e-e7ecfb98a422.svg"
download icon-population.svg "https://www.figma.com/api/mcp/asset/3e04159a-4997-4962-b3d5-23c6545baaad.svg"
download icon-quality.svg "https://www.figma.com/api/mcp/asset/a372dd7b-935b-4678-b622-f8a0ccc25ee7.svg"
download icon-mission-city.svg "https://www.figma.com/api/mcp/asset/32811fd1-1099-494d-ad1f-41644c097c72.svg"
download icon-mission-industry.svg "https://www.figma.com/api/mcp/asset/5c3e4a4f-bcfc-4c55-a3ab-f37b1a5283d3.svg"
download icon-mission-globe.svg "https://www.figma.com/api/mcp/asset/beb90f96-b042-4c72-ba73-d01b05c0913e.svg"
download icon-rail.svg "https://www.figma.com/api/mcp/asset/ca7b5bfe-50e5-4f31-9de7-a5593d01d878.svg"
download icon-highway.svg "https://www.figma.com/api/mcp/asset/4c5950be-4962-4858-bb4f-618c719167c1.svg"
download icon-airport.svg "https://www.figma.com/api/mcp/asset/78ed302e-eab1-4a68-baee-dafa370c3075.svg"
download icon-global.svg "https://www.figma.com/api/mcp/asset/8490d24e-7b46-4911-8670-df13f14a73a3.svg"
download icon-category-housing.svg "https://www.figma.com/api/mcp/asset/e1bdf830-9fbf-431a-aac3-dde8e5ad4a4f.svg"
download icon-category-social.svg "https://www.figma.com/api/mcp/asset/ab7c6433-034b-4bcd-be3c-608277651d05.svg"
download icon-category-transport.svg "https://www.figma.com/api/mcp/asset/8dcfe1ff-f0ef-41c0-93fd-d711b8b6f686.svg"
download icon-category-engineering.svg "https://www.figma.com/api/mcp/asset/e78fc4f5-c462-42c1-91b1-3ab2b203366a.svg"
download icon-category-ecology.svg "https://www.figma.com/api/mcp/asset/72e1c540-cd44-4724-89a5-e894edf033b2.svg"
download icon-category-tourism.svg "https://www.figma.com/api/mcp/asset/34f0d296-6242-46fc-b1ca-876f286f1c4f.svg"
download icon-close.svg "https://www.figma.com/api/mcp/asset/bf08358d-f51a-445f-b02f-f0a894ed81d5.svg"
download icon-plus.svg "https://www.figma.com/api/mcp/asset/702d7ffd-3589-4fb2-b756-af37d08575b6.svg"
download map-hint.svg "https://www.figma.com/api/mcp/asset/17f8d9ff-8051-4cf5-8d00-6d4cd598aeb5.svg"
download icon-map-drag.svg "https://www.figma.com/api/mcp/asset/571a78bf-e1db-4b48-94a6-26c4b2f6cdb9.svg"
download logo-25-cities.svg "https://www.figma.com/api/mcp/asset/53fa29bf-f22f-44fb-9861-0ed814ac67aa.svg"

download_font() {
  local target="$1"
  local url="$2"
  if [[ ! -s "assets/fonts/$target" ]]; then
    curl --fail --location --retry 3 --silent --show-error "$url" --output "assets/fonts/$target"
  fi
}

download_font tiktok-sans-cyrillic.woff2 "https://cdn.jsdelivr.net/fontsource/fonts/tiktok-sans:vf@5.3.0/cyrillic-wght-normal.woff2"
download_font tiktok-sans-latin.woff2 "https://cdn.jsdelivr.net/fontsource/fonts/tiktok-sans:vf@5.3.0/latin-wght-normal.woff2"

find assets -maxdepth 1 -type f -name '*.png' ! -name 'favicon-25.png' -delete
touch assets/.webp-v2

echo "Figma assets are ready."
