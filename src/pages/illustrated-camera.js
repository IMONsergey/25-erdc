const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export function illustratedCamera(width, height, target, focused, zoom = 1, pan = [0,0], space) {
  const imageWidth = Math.max(width, height * 1672 / 941);
  const imageHeight = imageWidth * 941 / 1672;
  const free = space || { left: 25, right: width - 25, top: 70, bottom: height - 45 };
  const tx = target[0] / 100, ty = target[1] / 100;
  const minimum = focused && imageWidth ? Math.max(1.25, free.left / (tx * imageWidth), (width - free.right) / ((1 - tx) * imageWidth)) : 1.015;
  const scale = clamp(minimum * zoom, 1.015, 3);
  const centerX = (free.left + free.right) / 2;
  const centerY = focused ? (free.top + free.bottom) / 2 : height / 2;
  const x = centerX - tx * imageWidth * scale + pan[0];
  const y = centerY - (focused ? ty : .5) * imageHeight * scale + pan[1];
  return { width: imageWidth, height: imageHeight, scale, x: clamp(x, width - imageWidth * scale, 0), y: clamp(y, height - imageHeight * scale, 0) };
}
