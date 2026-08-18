# 25 ERDC — Владивосток

Адаптивная React-верстка страницы мастер-плана агломерации Владивостока по Figma-макету.

## Локальный запуск

```bash
npm install
npm run dev
```

Production-сборка: `npm run build`. GitHub Pages автоматически собирает и публикует `dist/`.

## Структура

- `src/components/` — независимые блоки и интерактивы страницы;
- `src/data.js` — контент городов, категорий и проектов;
- `src/styles.css` — дизайн-система и desktop/tablet/mobile адаптив;
- `scripts/fetch-assets.sh` — однократное сохранение исходных Figma-ассетов;
- `.github/workflows/pages.yml` — автоматический деплой на GitHub Pages.
