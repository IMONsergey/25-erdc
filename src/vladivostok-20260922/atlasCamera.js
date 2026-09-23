// Keep every edge of the artwork outside the visible viewport, including during
// the interpolated move between projects. Anchors share the artwork's coordinates.
export function getAtlasCamera(viewWidth, viewHeight, target, focused) {
  const aspect = 1672 / 941;
  const width = Math.max(viewWidth, viewHeight * aspect);
  const height = width / aspect;
  const zoom = focused ? 1.18 : 1.015;
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  const limitX = Math.max(0, (width * zoom - viewWidth) / 2 - 2);
  const limitY = Math.max(0, (height * zoom - viewHeight) / 2 - 2);
  return {
    width,
    height,
    zoom,
    x: focused ? clamp((0.5 - target[0] / 100) * width * zoom, limitX) : 0,
    y: focused ? clamp((0.5 - target[1] / 100) * height * zoom, limitY) : 0,
  };
}
