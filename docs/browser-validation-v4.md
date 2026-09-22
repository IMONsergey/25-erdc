# Ocean palette, hero join and ATR image — 22 September 2026

Source commit: `bbae4192dda4904c9451cb6e5fe7612c7e412e5e`.
Pages run: https://github.com/IMONsergey/25-erdc/actions/runs/35723149997

## Changes

- Hero shading is attached to the hero section, outside the moving photo layer.
  Its fully opaque bottom colour matches the first colour of the territory section.
- The territory gradient starts locally inside that section, so its top colour
  does not depend on the height of the hero or selected city story.
- The original Figma city linework is rendered with grayscale/contrast and screen
  blending over a shared sea-colour base. Hover preserves the same palette.
- ATR now shows a newly generated photographic concept of a Pacific port and
  outbound container ship. The old strategic map remains on the Transsib tab.
  Prompt and provenance: `image-prompt-atr-v1.json`.
- No project records, counts or anchors were changed.

## Verification

- Production build and GitHub Pages deployment passed.
- Desktop scroll: hero bottom, shade bottom and territory top all measured y=530;
  the shade has no transform while the image retains its parallax movement.
- Screenshot samples at four horizontal positions on either side of the join
  all read RGB(3,43,69), within JPEG rounding of the shared #032b46 background.
- All three city illustrations load. Selected and inactive tiles retain the same
  grayscale(1) contrast(1.2) filter and screen blend; no hover saturation override.
- Mobile 390 px iframe: document width and scroll width both 375 px, hero shade
  remains outside the photo layer, and the new illustration colour treatment applies.
- ATR image loads at 1536 × 1024 with cover framing and the expected description.
  Switching to Transsib shows the original diagram; switching back restores the
  generated port image. Verified the ATR image also loads in the mobile layout.

Evidence:
- previews/hero-seamless-v4.jpg
- previews/city-palette-v4.jpg
- previews/mission-atr-v4.jpg
