# CLAUDE.md — Portfolio "Дмитрий — AI & Design"

Этот файл даёт полный контекст проекта для нового чата.
Читай этот файл ПЕРВЫМ.

---

## Проект одной строкой

Персональный сайт-портфолио Дмитрия (AI-визуал, автоматизация, фото/видео/брендинг).
Цель: привлекать клиентов → Telegram.
Стиль: **Premium light, warm off-white фон, cinematic animations, минимализм**.

---

## Стек

```
Framework:  Next.js 16.2.1 (App Router, Turbopack)
Runtime:    React 19
Styling:    Tailwind CSS v4 (@import "tailwindcss", без конфиг-файла)
Animations: framer-motion v12 (variants, whileInView, suppressHydrationWarning)
Scroll:     Lenis v1.3+ (lerp: 0.08, smoothWheel)
Icons:      lucide-react
UI/UX:      epic-design скилл для cinematic depth, stagger, parallax
Fonts:      Space Grotesk + JetBrains Mono (Google Fonts, next/font)
Deploy:     Vercel
```

---

## Структура проекта

```
Сайт портфолио/
├── CLAUDE.md                      ← ТЫ ЗДЕСЬ
├── docs/                          ← research + PRD (справка)
└── portfolio-next/                ← ВЕСЬ КОД
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx         ← fonts, metadata, SmoothScroll
    │   │   ├── page.tsx           ← StickyNav + HeroSection + Works + About + Footer
    │   │   └── globals.css        ← design tokens, btn-primary/secondary, grain
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── hero.tsx       ← Hero-секция (GlowMenu, stats, live badge)
    │   │   │   └── glow-menu.tsx  ← 3D flip nav (MenuBar компонент)
    │   │   ├── StickyNav.tsx      ← фиксированный nav при скролле
    │   │   ├── Works.tsx          ← сетка работ (stagger, divider)
    │   │   ├── WorkCard.tsx       ← карточка (hover scale, lazy load)
    │   │   ├── About.tsx          ← услуги, стата (stagger, hover fill)
    │   │   ├── Footer.tsx         ← контакт + CTA
    │   │   ├── MagneticWrapper.tsx← RAF magnetic hover
    │   │   └── SmoothScroll.tsx   ← Lenis init
    │   ├── data/
    │   │   └── works.ts           ← массив проектов
    │   └── lib/
    │       └── utils.ts           ← cn() = clsx + tailwind-merge
    └── package.json
```

---

## Дизайн-система

```
--bg:       #EDEAE4   (warm off-white, основной)
--surface:  #E5E2DC   (карточки)
--text:     #0A0A0A   (почти чёрный)
--muted:    rgba(0,0,0,0.45)
--cyan:     #0891B2
--orange:   #EA580C
--blue:     #1D4ED8
```

- `.btn-primary` — чёрная `min-h-44px`, `touch-action: manipulation`, hover lift+shadow
- `.btn-secondary` — transparent border, cyan на hover
- `.gradient-text` — cyan → orange → blue gradient
- `.work-card` — hover lift + image scale
- Grain-оверлей `opacity: 0.04` на `body::before`

---

## Ключевые техники (epic-design скилл)

### Motion System
- **Text Mask Reveal** — `overflow: hidden` + `y: "100%" → "0%"`, duration `1.1s`
- **Stagger Grid** — WorkCard: `staggerChildren: 0.08s`, About services: `0.07s`
- **Divider Wipe** — `scaleX: 0 → 1`, origin left, duration `0.8s`
- **Scroll Indicator** — `scaleY + opacity` pulse, duration `2s`
- **Press Feedback** — buttons `:active` с `scale(0.97)`

### Depth & Atmosphere
- Depth-0: atmospheric blobs, grid (низкий opacity)
- Depth-4: main content (text, images, buttons)
- Blur на blobs: `filter: blur(80-120px)`, opacity `0.06-0.09`

### Accessibility
- `aria-label` на кнопках, секциях, nav
- `aria-hidden="true"` на decorative элементах
- `min-height: 44px` для всех touch targets
- `prefers-reduced-motion` support — все animations выключаются
- `loading="lazy"` на images
- Semantic HTML5: `<section>`, `<header>`, `<nav>`, `<article>`, `role="list"`

### Performance
- `will-change: transform` только на анимирующихся элементах
- `transform` + `opacity` только (no width/height/top/left)
- `suppres sHydrationWarning` на всех motion-элементах
- IntersectionObserver через `whileInView={{ once: true }}`
- `width/height` на `<img>` для CLS prevention

---

## GlowMenu в двух местах

**Hero header** (сразу видна)
- По центру: "Работы" (Briefcase, violet) / "Обо мне" (User, cyan) / "Контакт" (Mail, blue)
- 3D flip на hover (rotateX front/back)
- Per-item radial glow + nav-level glow (синий→фиолетовый→красный)

**StickyNav** (при скролле > 85vh)
- Идентичная компоновка
- Фиксированная позиция `top-4`
- Появляется с fade+slide

---

## Hero — что новое

- **Stats** — 50+ проектов, 3+ года опыта, AI first (социальное доказательство)
- **Live badge** — ping-анимация на иконке
- **Divider** — номер секции `— 01 Портфолио`
- **Single CTA** — только Telegram в header + главная CTA внизу
- **Атмосфера** — depth-0 blobs, fine grid, soft gradients

---

## Works — улучшения

- **Номер секции** — `— 01 Портфолио`
- **Count badge** — `06` (количество работ) большими цифрами, opacity 0.1
- **Divider** — scaleX reveal
- **Stagger grid** — WorkCard с задержкой `0.08s` на каждую
- **Footer CTA** — top border, улучшенный текст

---

## About — улучшения

- **Номер секции** — `— 02 Обо мне`
- **Divider** — scaleX reveal
- **Stagger list** — услуги с `0.07s` задержкой
- **Hover interactions** — fill bg `rgba(0,0,0,0.025)`, arrow `→`, x shift `5px`
- **Атмосфера** — depth-1 blur blob top-right

---

## Как запустить локально

### 1. Установка зависимостей
```bash
cd "c:\Users\Hopeless Blessed\Desktop\Сайт портфолио\portfolio-next"
npm install
```

### 2. Dev сервер (hot reload)
```bash
npm run dev
```
Откроется на `http://localhost:3000`

### 3. Production сборка + запуск
```bash
npm run build
npm run start
```

### 4. Очистка кэша (если глюки)
```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

## Что нужно доделать

- [ ] Добавить изображения работ → `public/works/`
- [ ] Заполнить `src/data/works.ts` с реальными проектами
- [ ] Обновить ссылку WhatsApp в `src/lib/constants.ts`
- [ ] Финальный текст about-секции
- [ ] Ссылки на Instagram / соцсети
- [ ] Vercel deploy

---

## Сессия редизайна — прогресс (2026-03-26)

### Проведён UI/UX аудит
Сделаны скриншоты всех секций, выявлены проблемы:
1. Hero: пустая правая половина (декоративные пилюли без смысла)
2. Типографика h1: три разных стиля без логики
3. Хедер без логотипа слева
4. Дублирующиеся CTA кнопки (хедер + hero)
5. `work-card img` зумирован `scale(1.15)` по дефолту — баг
6. Языковой хаос (RU hero + EN заголовки секций)
7. About секция визуально пустая после списка
8. `TELEGRAM_URL` задублирован в 4 файлах
9. Двойной `style` атрибут на h2 в About (баг, lineHeight терялся)
10. Active nav state не синхронизирован со скроллом

### Проведён Discovery Interview
Решения согласованы:
- **Hero**: текст слева + параллакс-скролл; справа — зацикленное видео с собой (placeholder пока нет видео)
- **Фон**: floating paths анимация на весь сайт (компонент с 21st.dev)
- **Логотип**: wordmark «Дмитрий» слева в хедере
- **Язык**: всё на русском (`Selected Work` → `Избранные работы`, `Let's talk` → русский)
- **About**: добавить Skills-блок (Midjourney, Figma, n8n и др.)
- **Типографика**: оставить 3 строки, но выстроить чёткую иерархию

### ✅ Приоритет 1 — Быстрые фиксы (ВЫПОЛНЕНО)
- [x] Вынесен `TELEGRAM_URL` и `WHATSAPP_URL` в `src/lib/constants.ts`
- [x] Убран `scale(1.15)` на `.work-card img` по дефолту (globals.css + WorkCard.tsx)
- [x] Исправлен двойной `style` на `h2` в About.tsx (баг с lineHeight)
- [x] Добавлен `IntersectionObserver` в StickyNav — nav теперь синхронизирован со скроллом

### ✅ Приоритет 2 — Hero редизайн (ВЫПОЛНЕНО)
- [x] Wordmark «Дмитрий» слева в хедере (убрать пустой div-спейсер)
- [x] Убрать дублирующую CTA кнопку "Написать" из хедера Hero
- [x] Параллакс-скролл на Hero (текст уходит вверх быстрее фона)
- [x] Правая часть Hero: NeuroNoise shader blob (`@paper-design/shaders-react`)
- [x] Убрать floating pills (Визуал / Брендинг / Автоматизация)
- [x] Stats: «AI first подход» → «100% AI-подход»
- [ ] Перевести "Selected Work" → "Избранные работы", "Let's talk" → русский

### ✅ Приоритет 3 — About (ВЫПОЛНЕНО)
- [x] Skills-блок: сетка инструментов (15 tools, 5x3 grid, hover cyan, stagger animation)

### ✅ Приоритет 4 — Языковая унификация (ВЫПОЛНЕНО)
- [x] "Selected Work" → "Избранные работы" (Works.tsx)
- [x] "Let's talk" → "Поговорим" (Footer.tsx)

### ✅ Приоритет 5 — StickyNav polish (ВЫПОЛНЕНО)
- [x] backdrop-blur на хедер при скролле (StickyNav.tsx)

### Архитектурные решения принятые в сессии
- Все URL-константы → `src/lib/constants.ts`
- Язык сайта: **русский** (EN только там где это стилистика: названия инструментов, tech-термины)
- Hero visual: сначала shader blob как плейсхолдер, потом заменить на видео

### Правила работы с текстом
- **Любой текст от первого лица (bio, about, копирайтинг сайта) — обязательно прогонять через `/humanizer` скилл после написания**
- Сначала написать черновик, затем вызвать `/humanizer` чтобы убрать AI-паттерны и добавить живой голос

---

## Ресёрч проблем и решений

### 1. Hero: пустая правая половина
| Аспект | Деталь |
|--------|--------|
| **Проблема** | Весь контент прибит влево, справа — 3 декоративные pills + точки. Дисбаланс: слева 60% плотности, справа 40% пустоты. |
| **Решение** | **Split layout:** слева текст + параллакс, справа — зацикленное видео с собой (плейсхолдер: shader blob из `@paper-design/shaders-react`). |
| **Как реализовать** | `useScroll` + `useTransform` из framer-motion на hero-text: `y: 0 → -100px` при скролле вниз. Видео в `<video>` тег: `autoPlay muted loop`. |
| **Файл** | `src/components/ui/hero.tsx` |

---

### 2. Типографика h1: хаос из 3 стилей
| Аспект | Деталь |
|--------|--------|
| **Проблема** | Gradient light (5vw) + black 10vw + muted mono (5vw) — три веса, три цвета, три шрифта. Глаз не знает куда смотреть. |
| **Решение** | Оставить 3 строки, но выстроить иерархию: 1) акцент (gradient, меньше), 2) hero word (чёрный, максимум), 3) descriptor (muted, может быть subtitle). |
| **Как реализовать** | `"AI & Design"` (accent, gradient) + `"Визуал"` (hero, black 10vw) остаются в h1. `"Автоматизация"` → в `<p className="text-muted">` как subline. |
| **Файл** | `src/components/ui/hero.tsx` |

---

### 3. Хедер без логотипа
| Аспект | Деталь |
|--------|--------|
| **Проблема** | Слева пустой `<div className="w-28 hidden md:block" />`, брэнд не идентифицирован. |
| **Решение** | Wordmark **"Дмитрий"** слева — Space Grotesk, font-black, tracking-tighter. |
| **Как реализовать** | Заменить пустой div на `<a href="#hero" className="font-black text-lg tracking-tighter">Дмитрий</a>`. |
| **Файл** | `src/components/ui/hero.tsx` (header section) |

---

### 4. Дублирующиеся CTA кнопки
| Аспект | Деталь |
|--------|--------|
| **Проблема** | "Написать" в хедере Hero + "Написать в Telegram" в hero-контенте — два одинаковых действия на одном экране. |
| **Решение** | Убрать CTA из хедера Hero. CTA только в main content + в StickyNav (при скролле). |
| **Как реализовать** | Удалить блок `{/* CTA — right */}` из header в `hero.tsx`. Оставить только в контенте Hero. |
| **Файл** | `src/components/ui/hero.tsx` (lines ~108-122) |

---

### 5. work-card img scale(1.15) по дефолту ✅ ИСПРАВЛЕНО
| Аспект | Деталь |
|--------|--------|
| **Проблема** | Изображения всегда обрезаны — выглядит как баг, не как эффект. |
| **Решение** | `scale(1.0)` по дефолту, `scale(1.05)` только на hover. |
| **Статус** | ✅ Исправлено в `globals.css` (line 196) и `WorkCard.tsx` (line 41-42) |

---

### 6. Языковой хаос (RU + EN)
| Аспект | Деталь |
|--------|--------|
| **Проблема** | Hero — русский, Works/About/Footer — английский ("Selected Work", "Let's talk"). Непоследовательно. |
| **Решение** | **Всё на русском.** EN допустим только для: tech-терминов (Figma, n8n), названий услуг как бренд (Photo & Video, Branding, Automation). |
| **Как реализовать** | `Selected Work` → `Избранные работы`, `Let's talk` → `Поговорим`, заголовки секций на RU. |
| **Файлы** | `Works.tsx` (line 50), `Footer.tsx` (line 40) |

---

### 7. About секция визуально пустая
| Аспект | Деталь |
|--------|--------|
| **Проблема** | После 4 пунктов услуг огромный белый пробел до footer. Контента недостаточно. |
| **Решение** | Добавить **Skills-блок** под списком услуг: сетка тегов-пилюль инструментов. |
| **Как реализовать** | Новый компонент `<Skills />` с массивом: `["Midjourney", "Runway", "After Effects", "Figma", "n8n", "Make", "CapCut", "Stable Diffusion", "Synthesia"]`. Stagger анимация (delay 0.05s). |
| **Файл** | `src/components/About.tsx` (добавить Skills компонент) |

---

### 8. TELEGRAM_URL в 4 файлах ✅ ИСПРАВЛЕНО
| Аспект | Деталь |
|--------|--------|
| **Решение** | Вынесено в `src/lib/constants.ts`. |
| **Статус** | ✅ Исправлено: hero.tsx, Works.tsx, StickyNav.tsx, Footer.tsx обновлены. |

---

### 9. Двойной style на h2 в About ✅ ИСПРАВЛЕНО
| Аспект | Деталь |
|--------|--------|
| **Проблема** | `style={{ lineHeight: "1.0", ... }}` и `style={{ letterSpacing: "-0.04em", ... }}` — второй перезаписывает первый. |
| **Решение** | Один `style` с обоими свойствами. |
| **Статус** | ✅ Исправлено в `About.tsx` (line 77) |

---

### 10. Active nav не синхронизирован со скроллом ✅ ИСПРАВЛЕНО
| Аспект | Деталь |
|--------|--------|
| **Проблема** | Nav-элемент подсвечивается только при клике, не при скролле до секции. |
| **Решение** | IntersectionObserver для каждой секции (`#works`, `#about`, `#contact`). |
| **Статус** | ✅ Добавлено в `StickyNav.tsx`: useEffect с IntersectionObserver, threshold 0.35. |

---

### 11. Floating pills в Hero (декор без функции)
| Аспект | Деталь |
|--------|--------|
| **Проблема** | "Визуал", "Брендинг", "Автоматизация" справа — не кликабельны, не ведут информацию, хаотично анимируются. |
| **Решение** | **Убрать полностью.** Место займёт правый visual-блок (видео/shader blob). |
| **Как реализовать** | Удалить весь блок `{/* DEPTH-2/3: Floating right-side elements */}` из `hero.tsx` (lines ~277-360). |
| **Файл** | `src/components/ui/hero.tsx` |

---

### 12. StickyNav: текст проходит через прозрачный хедер
| Аспект | Деталь |
|--------|--------|
| **Проблема** | При скролле контент просвечивает сквозь nav без подложки/стекла. |
| **Решение** | Добавить backdrop-blur + полупрозрачный фон на весь `<motion.header>`. |
| **Как реализовать** | На `motion.header` добавить: `style={{ background: "rgba(237,234,228,0.8)", backdropFilter: "blur(12px)" }}` |
| **Файл** | `src/components/StickyNav.tsx` (line 52) |

---

### 13. Stats "AI first подход" — не метрика
| Аспект | Деталь |
|--------|--------|
| **Проблема** | "AI" стоит рядом с "50+" и "3+" как будто число, но это качественный атрибут. |
| **Решение** | Заменить на реальную метрику: `{ value: "100%", label: "AI-подход" }` или `{ value: "∞", label: "идей" }`. |
| **Как реализовать** | Изменить STATS в `hero.tsx` (lines 36-40). |
| **Файл** | `src/components/ui/hero.tsx` |

---

## Сводка по приоритетам реализации

1. **Приоритет 1** ✅ — Быстрые фиксы (4/4 выполнены)
2. **Приоритет 2** ✅ — Hero редизайн (6/6 выполнены)
3. **Приоритет 3** ✅ — About Skills-блок (выполнено)
4. **Приоритет 4** ✅ — Языковая унификация (2/2 выполнены)
5. **Приоритет 5** 🔲 — StickyNav polish (backdrop-blur — опционально)

---

---

# 🚀 СТРАТЕГИЧЕСКИЙ ПЛАН РАЗВИТИЯ ПРОЕКТА (26.03.2026)

## 📊 ИТОГИ ПОЛНОГО АУДИТА

**Всего выявлено:** 120+ проблем
- **Критические (блокирующие):** 8
- **Высокий приоритет:** 15
- **Средний приоритет:** 28
- **Низкий приоритет:** 70+

**Основные проблемные зоны:**
- Доступность (Accessibility): 18 проблем
- Производительность (Performance): 22 проблема
- Баги и логические ошибки: 17 проблем
- Mobile responsiveness: 14 проблем
- Animation/Interaction UX: 15 проблем
- Code quality: 20 проблем

---

## 🔴 ФАЗА 1: КРИТИЧЕСКИЕ ФИКСЫ (БЛОКИРУЮЩИЕ)

**Статус:** ✅ DONE

### 1.1 CustomCursor — Global cursor: none нарушает клавиатурную навигацию
- **Файл:** `src/components/CustomCursor.tsx` (lines 134-138)
- **Проблема:** Global `cursor: none` скрывает курсор для всех пользователей, включая использующих клавиатуру
- **Почему блокирует:** Нарушает WCAG 2.1 Level A (доступность)
- **Решение:** Скрыть курсор только на интерактивных элементах (button, a, [role="button"])
- **Статус:** ✅ DONE

### 1.2 CustomCursor — Утечка памяти в addEventListener
- **Файл:** `src/components/CustomCursor.tsx` (line 68)
- **Проблема:** `addEventListener` вызывается на каждый рендер из-за `[isVisible]` зависимости, listeners накапливаются
- **Почему блокирует:** Утечка памяти, падение производительности со временем
- **Решение:** Пустой dependency array `[]` (глобальные listeners)
- **Статус:** ✅ DONE

### 1.3 Hero Wave Shader — Волна едва видна на светлом фоне
- **Файл:** `src/components/ui/web-gl-shader.tsx` (lines 37-60, 146)
- **Проблема:** mixBlendMode "lighten" + светлый фон #EDEAE4 = волна невидима
- **Почему блокирует:** Hero выглядит сломанным/неполным, главный визуальный элемент не виден
- **Решение:** alpha = яркость волны (0 там где нет волны), mixBlendMode: "normal"
- **Статус:** ✅ DONE

### 1.4 Lenis Smooth Scroll — Не реализована функциональность
- **Файлы:** `hero.tsx`, `StickyNav.tsx` (nav links), `src/components/SmoothScroll.tsx`
- **Проблема:** Lenis инициализирован но не используется. Клики по nav прыгают вместо плавного скролла
- **Почему блокирует:** Сломана основная UX функция сайта
- **Решение:** Создать `useLenisScroll()` hook и использовать на всех anchor links
- **Статус:** ✅ DONE

### 1.5 Keyboard Focus Visible — Фокус невидим при табуляции
- **Файл:** Весь сайт (CustomCursor скрывает outline)
- **Проблема:** При табуляции фокус не виден из-за custom cursor
- **Почему блокирует:** Невозможно управлять сайтом только с клавиатуры
- **Решение:** Добавить видимый focus outline + detect keyboard vs mouse
- **Статус:** ✅ DONE

### 1.6 IntersectionObserver — Конфликт при нескольких видимых секциях
- **Файл:** `src/components/StickyNav.tsx` (lines 52-75)
- **Проблема:** Threshold 0.35 может сделать несколько секций "активными" одновременно
- **Почему блокирует:** Nav item active state непредсказуем
- **Решение:** Threshold 0.5+ или "closest section to viewport center" алгоритм
- **Статус:** ✅ DONE

### 1.7 Preloader Race Condition — hardFallback может вызвать двойной onComplete
- **Файл:** `src/lib/preloader-context.tsx` (line 28)
- **Проблема:** `hardFallback` setTimeout может вызвать `onComplete()` дважды
- **Почему блокирует:** Странное поведение при разминировании компонента
- **Решение:** Использовать ref-based check или абортить timer в cleanup
- **Статус:** ✅ DONE

### 1.8 MagneticWrapper RAF — Frame skipping из-за несинхронизированных анимаций
- **Файл:** `src/components/MagneticWrapper.tsx` (lines 26-27, 39-48)
- **Проблема:** RAF + setTimeout таймаут несинхронизированы, может вызвать janky animation
- **Почему блокирует:** Видимое падение FPS на медленных устройствах
- **Решение:** Использовать `transitionend` event listener вместо setTimeout
- **Статус:** ✅ DONE

---

## 🟠 ФАЗА 2: ПРОИЗВОДИТЕЛЬНОСТЬ

**Статус:** ✅ DONE

### 2.1 InfiniteGrid — Высоко-частотный setState каждый фрейм
- **Файл:** `src/components/ui/infinite-grid.tsx` (line 18)
- **Проблема:** `setOffset()` вызывается ~60 раз в секунду
- **Решение:** Throttle до 30fps или использовать CSS @keyframes animation
- **Статус:** ✅ DONE

### 2.2 Unused GSAP Dependency
- **Файл:** `package.json`
- **Проблема:** GSAP может быть не используется (30KB+ в bundle)
- **Решение:** Проверить с `npm run build && npx bundle-buddy`, удалить если не используется
- **Статус:** ✅ DONE

### 2.3 Preloader SVG Grain Filter — Дублирует глобальный grain
- **Файл:** `src/components/Preloader.tsx` (lines 51-57)
- **Проблема:** SVG filter дорогой, дублирует grain из globals.css
- **Решение:** Удалить SVG filter из Preloader, оставить только глобальный
- **Статус:** ✅ DONE

### 2.4 CustomCursor RAF — Обновляет DOM каждый фрейм без throttle
- **Файл:** `src/components/CustomCursor.tsx` (lines 49-54)
- **Проблема:** RAF loop + прямое манипулирование style каждый фрейм
- **Решение:** useMotionValue + useTransform из framer-motion
- **Статус:** ✅ DONE

---

## 🟡 ФАЗА 3: ДОСТУПНОСТЬ (ACCESSIBILITY)

**Статус:** ✅ DONE

### 3.1 Preloader без Live Region
- **Файл:** `src/components/Preloader.tsx` (line 83)
- **Решение:** Добавить `aria-live="polite"` для счётчика прогресса
- **Статус:** ✅ DONE

### 3.2 StickyNav Menu Missing aria-expanded
- **Файл:** `src/components/StickyNav.tsx` (line 120)
- **Решение:** Добавить `aria-expanded={mobileOpen}` на кнопку toggle
- **Статус:** ✅ DONE

### 3.3 WorkCard не доступна на клавиатуре
- **Файл:** `src/components/WorkCard.tsx` (lines 88-104)
- **Проблема:** Overlay появляется только на hover, нет focus state
- **Решение:** Добавить `whileFocus` и keyboard support
- **Статус:** ✅ DONE

### 3.4 Footer Link Contrast — opacity-30 не проходит WCAG AA
- **Файл:** `src/components/Footer.tsx` (line 119)
- **Решение:** Увеличить opacity до `opacity-60+` или использовать другой цвет
- **Статус:** ✅ DONE

---

## 🟢 ФАЗА 4: ДУБЛИРОВАНИЕ КОДА И РЕФАКТОРИНГ

**Статус:** ✅ DONE

### 4.1 TextReveal компонент дублирован
- **Файлы:** `Works.tsx` и `About.tsx`
- **Решение:** Извлечь в `src/components/ui/TextReveal.tsx`
- **Статус:** ✅ DONE

### 4.2 NAV_ITEMS дублирован
- **Файлы:** `hero.tsx` и `StickyNav.tsx`
- **Решение:** Вынести в `src/lib/nav-items.ts`
- **Статус:** ✅ DONE

### 4.3 ease переменная дублирована в 3 файлах
- **Файлы:** Works, About, Footer, telegram-button
- **Решение:** Вынести в `src/lib/constants.ts` как `EASE_DEFAULT`
- **Статус:** ✅ DONE

### 4.4 Централизовать категории и их цвета
- **Файлы:** WorkCard.tsx, About.tsx
- **Решение:** Вынести `categoryColors`, `categoryHue` в `src/lib/constants.ts`
- **Статус:** ✅ DONE

### 4.5 Вынести локальные данные в `src/data/`
- **Решение:** Создать `services.ts`, `skills.ts`
- **Статус:** ✅ DONE

### 4.6 Создать LenisContext вместо глобальной переменной
- **Файл:** `src/context/LenisContext.tsx` (новый)
- **Решение:** Правильно типизировать Lenis через контекст
- **Статус:** ✅ DONE

---

## 💻 ФАЗА 5: MOBILE RESPONSIVENESS И POLISH

**Статус:** ✅ DONE

### 5.1 MagneticWrapper не работает на touch
- **Файл:** `src/components/MagneticWrapper.tsx` (lines 14-32)
- **Решение:** Добавить onTouchMove handlers (копия mouse logic)
- **Статус:** ✅ DONE

### 5.2 InfiniteGrid gradient слишком большой на мобиле
- **Файл:** `src/components/ui/infinite-grid.tsx` (line 9-10)
- **Решение:** Responsive radius (150px mobile, 300px desktop)
- **Статус:** ✅ DONE

### 5.3 Hero right spacer бесполезен
- **Файл:** `src/components/ui/hero.tsx` (line 89)
- **Решение:** Удалить если не нужен для layout
- **Статус:** ✅ DONE

---

## 📈 МЕТРИКИ УСПЕХА

- ✅ Сайт полностью доступен с клавиатуры (WCAG 2.1 AA)
- ✅ Lighthouse Accessibility > 90
- ✅ Lighthouse Performance > 85 (mobile)
- ✅ Zero console errors/warnings
- ✅ Нет дублирования кода (DRY)
- ✅ Smooth scroll работает везде
- ✅ Hero wave shader выглядит как на референсе
- ✅ Touch devices полностью поддерживаются

---

## 📋 КАК ИСПОЛЬЗОВАТЬ ЭТОТ ПЛАН

**В каждом новом диалоге:**
1. Ссылаться на этот раздел как на "source of truth"
2. Выбирать фазы по приоритету
3. Не браться за новые задачи до завершения критических
4. Обновлять статусы по мере реализации (🔲 → ▶️ → ✅)

**Обновление статусов:**
```
🔲 PENDING   → ▶️ IN PROGRESS   → ✅ DONE
```

---

## 🗓 ТЕКУЩИЙ СТАТУС ПРОЕКТА (26.03.2026)

### ✅ Всё завершено из технического плана (Фазы 1–5)
Все критические фиксы, производительность, accessibility, рефакторинг и mobile polish — сделаны.

### ✅ Визуальные улучшения из epic-design аудита (быстрые)
- Число `03` в Works стало крупнее и заметнее
- Footer: faded `AI&Design` на фоне добавляет depth
- Skill-теги в About: hover scale + cyan glow
- Hero: parallax — контент уходит вверх при скролле
- Клетка `InfiniteGrid` теперь на весь сайт через `fixed`
- Курсор: тёмная точка + светящийся trail на canvas
- "Дмитрий" убран из Hero header
- Граница Hero/Works: градиентный fade снизу Hero

---

## 🔲 ЧТО ПРЕДСТОИТ СДЕЛАТЬ

### Приоритет 1 — Hero правая половина (ГЛАВНАЯ ЗАДАЧА)
**Проблема:** 50% экрана справа пустые — самая заметная визуальная проблема.
**Решение:** Вставить видео с собой (`.webm` с прозрачным фоном) или AI-визуал.

**Как подготовить видео:**
1. Снять себя на светлом фоне (~`#EDEAE4`)
2. Убрать фон в CapCut или RunwayML → экспортировать `.webm` (поддерживает alpha)
3. Положить в `public/hero-video.webm`
4. Сказать Claude — он напишет компонент и вставит в Hero правую часть

**Альтернатива без видео:** абстрактный AI-motion визуал / looping render твоих работ

### Приоритет 2 — Контент
- [ ] Добавить реальные изображения работ → `public/works/`
- [ ] Заполнить `src/data/works.ts` с реальными проектами (сейчас 3 placeholder)
- [ ] Финальный текст в About (bio)
- [ ] Обновить WhatsApp ссылку: `src/lib/constants.ts` → `WHATSAPP_URL`

### Приоритет 3 — Визуальные улучшения (из epic-design аудита) ✅ DONE
- [x] Scroll-triggered transitions между секциями (clip-path reveal)
- [x] `Есть проект?` в Footer — bleed typography на всю ширину
- [x] Весь текст сайта переработан (copywriting)

### Приоритет 4 — Deploy
- [ ] Vercel deploy
- [ ] Ссылки на соцсети (Instagram и др.)

---

## 🚀 КАК НАЧАТЬ НОВЫЙ ЧАТ

1. Прочитай этот файл
2. Сделай скриншот (`/screenshot-check`) чтобы видеть текущее состояние
3. Начинай с Приоритета 1 (Hero видео) если есть `.webm` файл
4. Иначе — с Приоритета 2 (контент) или 3 (визуал)
