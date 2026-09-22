# City card readability — 22 September 2026

Source: `4d0d45b0dffd846defb1337bf76ef863859a026d`.
Pages run: https://github.com/IMONsergey/25-erdc/actions/runs/35724884690

The client reported that the previous screen-blended cards looked washed out and
that the panorama linework interfered with the labels.

- Replaced the washed-out teal with a saturated blue gradient (#1b6b99, #155c89,
  #104b77). Lightened the first contrast pass in response to the client's request
  for bluer, less dark cards.
- Reframed illustrations into the upper 70% of each tile.
- Added a #104b77 text gradient that becomes opaque behind descriptions/actions.
- Brightened the screen-blended Figma linework while keeping its background blue.
- Increased title weight to 600 and desktop description size to 14 px.
- Moved pointer lighting behind content and masked it out of the text area.
- Strengthened borders and the secondary section heading.
- City data, page transitions and all 27 approved project points are unchanged.

Production build and Pages deployment passed. Verified the deployed CSS palette
and visually inspected desktop and phone (390 × 844) previews. White text is
clearly separated from the blue backgrounds; linework remains above descriptions.
Switching to Артём updates the city article correctly. The phone document has no
horizontal overflow (375 px content viewport and scroll width); all three card
text containers fit their 279 px widths. The tile rail retains intentional
horizontal scrolling.

Final desktop screenshot: `previews/city-contrast-v5.jpg`.
