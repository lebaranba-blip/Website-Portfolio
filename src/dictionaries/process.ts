// "How I work" — the order every case on the site follows. Facts come from the case pages.
export const processDict = {
  ru: {
    eyebrow: "— 03 Процесс",
    heading1: "Как я",
    heading2: "работаю",
    lead: "Порядок один на всех проектах. Его видно в каждом кейсе.",
    steps: [
      { title: "Раскадровка", text: "Кадры, тайминг и реплики расписаны до первой генерации. В PUMA это 25 кадров." },
      { title: "Персонажи и локации", text: "Листы лица, одежды и места действия. Герой и свет не меняются от сцены к сцене." },
      { title: "Генерация", text: "Собираю сценами. Последний кадр сцены становится референсом для следующей, поэтому склейки сходятся." },
      { title: "Пост", text: "Монтаж, звук, цветокоррекция, зерно, моушн-графика. DaVinci Resolve и Remotion." },
      { title: "Сдача", text: "Финальный мастер и версии под площадки." },
    ],
  },
  en: {
    eyebrow: "— 03 Process",
    heading1: "How I",
    heading2: "work",
    lead: "Same order on every project. You can see it in each case.",
    steps: [
      { title: "Storyboard", text: "Shots, timing and lines are written out before the first generation. PUMA had 25 frames." },
      { title: "Characters and locations", text: "Sheets for face, wardrobe and setting. The hero and the light stay the same from scene to scene." },
      { title: "Generation", text: "I build scene by scene. The last frame of one scene is the reference for the next, so the cuts match." },
      { title: "Post", text: "Edit, sound, color grading, grain, motion graphics. DaVinci Resolve and Remotion." },
      { title: "Delivery", text: "Final master and versions for each platform." },
    ],
  },
} as const
