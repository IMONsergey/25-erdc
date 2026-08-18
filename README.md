# 25 ERDC — Владивосток

Адаптивная статическая верстка страницы мастер-плана агломерации Владивостока по Figma-макету.

## Локальный запуск

После первого GitHub Pages-деплоя Figma-ассеты автоматически сохранятся в `assets/`.

```bash
python3 -m http.server 8080
```

Откройте `http://localhost:8080`.

## Структура

- `index.html` — семантическая разметка страницы;
- `styles.css` — дизайн-система, desktop/tablet/mobile адаптив;
- `script.js` — мобильное меню и состояния интерфейса;
- `scripts/fetch-assets.sh` — однократное сохранение исходных Figma-ассетов;
- `.github/workflows/pages.yml` — автоматический деплой на GitHub Pages.
