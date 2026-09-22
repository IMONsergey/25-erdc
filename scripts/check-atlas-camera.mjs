import assert from "node:assert/strict";
import { getAtlasCamera } from "../src/atlasCamera.js";
import { selectedProjects } from "../src/selectedProjects.js";

// Regression: selecting a northern project used to expose a blue strip above
// the artwork. Check coverage at both endpoints and throughout every move.
assert.equal(selectedProjects.length, 27);
const viewports = [
  [320, 435],
  [390, 435],
  [768, 850],
  [1024, 850],
  [1363, 936],
  [2048, 1100],
  [2560, 1100],
];
let checks = 0;
for (const [width, height] of viewports) {
  const cameras = [
    getAtlasCamera(width, height, [50, 50], false),
    ...selectedProjects.map(({ anchor }) =>
      getAtlasCamera(width, height, anchor, true),
    ),
  ];
  for (const from of cameras) {
    for (const to of cameras) {
      for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
        const mix = (key) => from[key] + (to[key] - from[key]) * progress;
        const drawnWidth = mix("width") * mix("zoom");
        const drawnHeight = mix("height") * mix("zoom");
        const left = (width - drawnWidth) / 2 + mix("x");
        const top = (height - drawnHeight) / 2 + mix("y");
        assert(
          left <= -1 &&
            top <= -1 &&
            left + drawnWidth >= width + 1 &&
            top + drawnHeight >= height + 1,
          `Exposed edge at ${width} × ${height}, progress ${progress}`,
        );
        checks++;
      }
    }
  }
}
console.log(
  `PASS: ${checks} camera coverage checks, all 27 approved projects, ${viewports.length} viewport sizes.`,
);
