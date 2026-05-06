# CLAUDE.md — Portfolio "Дмитрий — AI & Design"

Читай этот файл ПЕРВЫМ в каждом новом чате.

## ⚡ Старт чата

```bash
cd "c:\Users\Hopeless Blessed\Desktop\Сайт портфолио\portfolio-next"
npm run dev
```

Дев-сервер: `http://localhost:3000` — нужен для скриншотов и визуальной проверки.
Деплой: `https://website-portfolio-y48s.vercel.app` (GitHub → Vercel, автодеплой).

---

## Проект

Персональный сайт-портфолио Дмитрия. Цель: привлекать клиентов → Telegram (`https://t.me/hopeless_blessed`).
Стиль: **Premium light, warm off-white фон, cinematic animations, минимализм**.

---

## Стек

```
Framework:  Next.js 16.2.1 (App Router, Turbopack)
Runtime:    React 19
Styling:    Tailwind CSS v4 (@import "tailwindcss", без конфиг-файла)
Animations: framer-motion v12
Scroll:     Lenis v1.3+
Icons:      lucide-react
Fonts:      Golos Text + JetBrains Mono + Space Grotesk (next/font/google)
Deploy:     Vercel
```

---

## Структура

```
portfolio-next/src/
├── app/
│   ├── layout.tsx          ← metadata, JSON-LD, fonts
│   ├── page.tsx            ← StickyNav + Hero + Works + About + Footer
│   ├── globals.css         ← design tokens, .btn-primary, .btn-secondary, grain
│   ├── robots.ts           ← robots.txt
│   ├── sitemap.ts          ← sitemap.xml
│   └── opengraph-image.tsx ← динамический OG image
├── components/
│   ├── ui/
│   │   ├── hero.tsx        ← Hero-секция (WebGL shader, stats, live badge, parallax)
│   │   ├── glow-menu.tsx   ← 3D flip nav
│   │   └── web-gl-shader.tsx ← WebGL wave (Three.js, named imports)
│   ├── StickyNav.tsx       ← фиксированный nav (IntersectionObserver, backdrop-blur)
│   ├── Works.tsx           ← сетка работ
│   ├── WorkCard.tsx        ← карточка (ResizeObserver cached rect)
│   ├── FeaturedWorkCard.tsx← full-width карточка + галерея + видео
│   ├── About.tsx           ← услуги + skills + фото
│   ├── Footer.tsx          ← CTA + контакт
│   ├── Preloader.tsx       ← RAF loop, без setState, sessionStorage skip
│   ├── CustomCursor.tsx    ← canvas trail, только desktop
│   ├── MagneticWrapper.tsx ← magnetic hover + touch support
│   └── ScrollProgress.tsx  ← прогресс-бар
├── data/
│   ├── works.ts            ← массив проектов (Work interface)
│   ├── services.ts         ← список услуг
│   └── skills.ts           ← список инструментов
└── lib/
    ├── constants.ts        ← TELEGRAM_URL, EASE_DEFAULT, NAV_ITEMS, CATEGORY_COLORS
    ├── lenis-context.tsx   ← LenisContext
    └── preloader-context.tsx
```

---

## Дизайн-система

```
--bg:       #EDEAE4   (warm off-white)
--surface:  #E5E2DC   (карточки)
--text:     #0A0A0A
--muted:    rgba(0,0,0,0.45)
--cyan:     #0891B2
--orange:   #EA580C
--blue:     #1D4ED8
```

Шрифты: `var(--font-space-grotesk)` — основной, `var(--font-display)` — заголовки, `var(--font-jetbrains-mono)` — моно.
Анимации: `EASE_DEFAULT = [0.16, 1, 0.3, 1]`, stagger `0.07–0.08s`.
Кнопки: `.btn-primary` (чёрная), `.btn-secondary` (border, cyan hover), min-height 44px.

---

## Проекты в Works

| id | Страница | Тип |
|----|----------|-----|
| `gump-donuts` | `/works/gump` | featured + gallery + fullVideo |
| `ai-carousel` | `/works/carousel` | featured + carouselSets |
| `ai-avatar` | `/works/ai-avatar` | featured + gallery + fullVideo |

Новый проект: медиа → `public/works/<id>/`, запись → `src/data/works.ts`.

---

## Правила разработки

- **Текст от первого лица** — прогонять через `/humanizer` после написания
- **Любые UI изменения** — проверять через `/screenshot-check`
- **После любого фикса/бага** — запускать `npx tsc --noEmit`, затем деплоить
- **Анимировать только:** `transform`, `opacity`, `filter`, `clip-path`
- **Scroll listeners** — через IntersectionObserver, не `getBoundingClientRect` на каждый event
- **Изображения** — `next/image` с `sizes`, `priority` только на первом экране (Hero)
- **Константы** — все URL и общие значения в `src/lib/constants.ts`
- **Язык** — русский везде, EN только tech-термины и названия инструментов

## Производительность (мобиль)

- **НЕ делать `whileInView` с `opacity: 0→1` на уровне секции** — это главная причина мерцания. Секция рендерится невидимой, потом анимируется — на слабом железе дёргается. Анимировать только дочерние элементы внутри секции.
- **`priority` только у первого FeaturedWorkCard** — остальные `loading="lazy"`. Иначе браузер грузит все баннеры параллельно при старте.
- **TextReveal** — не использовать `overflow: hidden` + `y: "100%"` slideUp. Заменять на `opacity + y: 12px` fadeIn (нет clip = нет reflow).
- **quality изображений**: FeaturedWorkCard poster → 82, галерея → 78, WorkCard → 80, About фото → 82. Не выше 85 без явной причины.
- **`content-visibility: auto`** на `#works` и `#about` — браузер пропускает off-screen рендер.
- **`will-change: transform`** на `.work-card` — создаёт GPU layer заранее.

---

## Как добавить новый проект

1. Медиа → `public/works/<id>/` (латиница, без пробелов)
2. Запись в `src/data/works.ts`
3. Если нужна отдельная страница → `src/app/works/<id>/page.tsx`
4. Проверить: `npm run dev` → `/screenshot-check`
5. Деплой: `git add . && git commit -m "..." && git push`

---

## Деплой

```bash
git add .
git commit -m "описание"
git push
# Vercel деплоит автоматически за 1-2 мин
```

---

## Что предстоит сделать

- [ ] Hero: вставить видео с собой (`public/hero-video.webm`) в правую половину
- [ ] Обновить WhatsApp ссылку в `src/lib/constants.ts` → `WHATSAPP_URL`
- [ ] Ссылки на Instagram / соцсети в Footer
