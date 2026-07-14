export const motionTeaserDict = {
  ru: {
    nav: {
      allWorks: "Все работы",
      write: "Написать",
    },
    hero: {
      subtitle: "Не таймлайны. Не After Effects. Remotion + TypeScript — код превращается в видео кадр за кадром.",
      meta: [
        { label: "Стек", value: "Remotion · TypeScript" },
        { label: "Формат", value: "1920×1080 · 60fps" },
        { label: "Видео", value: "3 ролика" },
      ],
    },
    video: {
      soundOn: "Включить звук",
      soundOff: "Выключить звук",
    },
    section01: {
      label: "Demo Reel",
      heading1: "ТРИ РОЛИКА.",
      heading2: "ОДИН НАВЫК.",
      intro: "Три видео — три техники. Каждое снято с нуля через Remotion: от пустого компонента до финального MP4.",
      mainVideo: {
        label: "Motion Teaser",
        description: "Kinetic typography, icon animation, typewriter effect, blur transitions, sparkle particles — полный демо-рил навыков",
      },
      secondaryVideos: [
        {
          label: "Vivid Gradient",
          description: "Gradient wipe transitions, scene cuts, 60fps smooth motion",
        },
        {
          label: "Article Highlight",
          description: "Text highlight animation, word-by-word reveal, editorial style",
        },
      ],
    },
    section02: {
      label: "Как это работает",
      heading1: "REMOTION +",
      heading2: "TYPESCRIPT",
      intro: "Remotion превращает React-компоненты в видео. Каждый кадр — это рендер. Никаких GUI-таймлайнов, только код.",
      features: [
        { label: "spring()", desc: "physics-based easing вместо cubic-bezier" },
        { label: "interpolate()", desc: "frame-based значения для любого свойства" },
        { label: "useCurrentFrame()", desc: "текущий кадр как единственный источник истины" },
        { label: "Sequence & Series", desc: "монтаж из независимых сцен" },
        { label: "renderMedia()", desc: "CLI-рендер в MP4 / WebM / GIF" },
      ],
    },
    section03: {
      label: "Подход",
      heading1: "CODE-DRIVEN",
      heading2: "MOTION",
      intro: "Motion-дизайн через код даёт что-то недоступное в After Effects: версионирование, тесты, переиспользование, генерацию серий.",
      advantages: [
        {
          num: "01",
          title: "Git-версионирование",
          desc: "Каждая итерация анимации — это коммит. Откат, ветка, merge request — как в обычной разработке.",
          tag: "Dev workflow",
        },
        {
          num: "02",
          title: "Серии из массива",
          desc: "Нужно 20 вариантов с разным текстом? map() по массиву — и renderMedia() рендерит все параллельно.",
          tag: "Scalability",
        },
        {
          num: "03",
          title: "Параметрические сцены",
          desc: "Цвет, скорость, текст — всё через пропсы. Один компонент — бесконечно кастомизируемая сцена.",
          tag: "Flexibility",
        },
      ],
      stackHeading: "Стек",
      stack: [
        { name: "Remotion 4", sub: "React → Video" },
        { name: "TypeScript", sub: "Type-safe" },
        { name: "spring()", sub: "Physics easing" },
        { name: "renderMedia()", sub: "CLI render" },
      ],
    },
    section04: {
      label: "О проекте",
      heading: "О ПРОЕКТЕ",
      task: {
        eyebrow: "Задача",
        desc: "Доказать что motion-дизайн через код работает — без After Effects, без GUI-таймлайнов. Remotion + TypeScript от идеи до готового MP4.",
        tags: ["Motion Design", "Code-driven", "Remotion", "TypeScript"],
      },
      metrics: [
        { num: "3", unit: "видео", desc: "разные техники" },
        { num: "60", unit: "fps", desc: "smooth motion" },
        { num: "0", unit: "AE", desc: "только код" },
      ],
      done: {
        eyebrow: "Что сделано",
        items: [
          { label: "Kinetic typography", icon: "01" },
          { label: "Gradient wipe", icon: "02" },
          { label: "Typewriter effect", icon: "03" },
          { label: "Word-by-word reveal", icon: "04" },
          { label: "Sparkle particles", icon: "05" },
          { label: "CLI batch render", icon: "06" },
        ],
      },
      tools: {
        eyebrow: "Инструменты",
        list: ["Remotion 4", "TypeScript", "React 19", "Node.js", "FFmpeg", "Claude"],
        note: "Весь пайплайн code-native: от компонента до готового MP4 без сторонних приложений.",
      },
    },
    cta: {
      title1: "Нужен ",
      title2: "motion?",
      desc: "Kinetic typography, product animation, promo reel — от концепта до рендера. Код даёт скорость и масштаб.",
      primaryButton: "Написать в Telegram",
      ghostButton: "← Все работы",
    },
  },
  en: {
    nav: {
      allWorks: "All work",
      write: "Message",
    },
    hero: {
      subtitle: "No timelines. No After Effects. Remotion + TypeScript — code becomes video, frame by frame.",
      meta: [
        { label: "Stack", value: "Remotion · TypeScript" },
        { label: "Format", value: "1920×1080 · 60fps" },
        { label: "Videos", value: "3 clips" },
      ],
    },
    video: {
      soundOn: "Turn on sound",
      soundOff: "Turn off sound",
    },
    section01: {
      label: "Demo Reel",
      heading1: "THREE CLIPS.",
      heading2: "ONE SKILL.",
      intro: "Three videos, three techniques. Each built from scratch in Remotion — from an empty component to the final MP4.",
      mainVideo: {
        label: "Motion Teaser",
        description: "Kinetic typography, icon animation, typewriter effect, blur transitions, sparkle particles — the full skills demo reel",
      },
      secondaryVideos: [
        {
          label: "Vivid Gradient",
          description: "Gradient wipe transitions, scene cuts, 60fps smooth motion",
        },
        {
          label: "Article Highlight",
          description: "Text highlight animation, word-by-word reveal, editorial style",
        },
      ],
    },
    section02: {
      label: "How It Works",
      heading1: "REMOTION +",
      heading2: "TYPESCRIPT",
      intro: "Remotion turns React components into video. Every frame is a render. No GUI timelines — just code.",
      features: [
        { label: "spring()", desc: "physics-based easing instead of cubic-bezier" },
        { label: "interpolate()", desc: "frame-based values for any property" },
        { label: "useCurrentFrame()", desc: "the current frame as the single source of truth" },
        { label: "Sequence & Series", desc: "editing built from independent scenes" },
        { label: "renderMedia()", desc: "CLI render to MP4 / WebM / GIF" },
      ],
    },
    section03: {
      label: "Approach",
      heading1: "CODE-DRIVEN",
      heading2: "MOTION",
      intro: "Motion design through code gives you things After Effects can't: version control, tests, reuse, batch generation.",
      advantages: [
        {
          num: "01",
          title: "Git version control",
          desc: "Every animation iteration is a commit. Rollback, branch, merge request — just like regular development.",
          tag: "Dev workflow",
        },
        {
          num: "02",
          title: "Series from an array",
          desc: "Need 20 variants with different text? map() over an array, and renderMedia() renders them all in parallel.",
          tag: "Scalability",
        },
        {
          num: "03",
          title: "Parametric scenes",
          desc: "Color, speed, text — all through props. One component, an endlessly customizable scene.",
          tag: "Flexibility",
        },
      ],
      stackHeading: "Stack",
      stack: [
        { name: "Remotion 4", sub: "React → Video" },
        { name: "TypeScript", sub: "Type-safe" },
        { name: "spring()", sub: "Physics easing" },
        { name: "renderMedia()", sub: "CLI render" },
      ],
    },
    section04: {
      label: "About the Project",
      heading: "ABOUT THE PROJECT",
      task: {
        eyebrow: "Task",
        desc: "Prove that motion design through code works — no After Effects, no GUI timelines. Remotion + TypeScript from idea to final MP4.",
        tags: ["Motion Design", "Code-driven", "Remotion", "TypeScript"],
      },
      metrics: [
        { num: "3", unit: "videos", desc: "different techniques" },
        { num: "60", unit: "fps", desc: "smooth motion" },
        { num: "0", unit: "AE", desc: "code only" },
      ],
      done: {
        eyebrow: "What was built",
        items: [
          { label: "Kinetic typography", icon: "01" },
          { label: "Gradient wipe", icon: "02" },
          { label: "Typewriter effect", icon: "03" },
          { label: "Word-by-word reveal", icon: "04" },
          { label: "Sparkle particles", icon: "05" },
          { label: "CLI batch render", icon: "06" },
        ],
      },
      tools: {
        eyebrow: "Tools",
        list: ["Remotion 4", "TypeScript", "React 19", "Node.js", "FFmpeg", "Claude"],
        note: "The whole pipeline is code-native: from component to final MP4, no third-party apps.",
      },
    },
    cta: {
      title1: "Need ",
      title2: "motion?",
      desc: "Kinetic typography, product animation, promo reels — from concept to render. Code gives you speed and scale.",
      primaryButton: "Message on Telegram",
      ghostButton: "← All work",
    },
  },
} as const
