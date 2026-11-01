// Copy is approved by the author — keep it verbatim. Placeholders stay in [brackets].
export const pumaYouthDict = {
  ru: {
    nav: {
      allWorks: "Все работы",
      write: "Написать",
    },
    card: {
      title: "PUMA Suede — «Молодость»",
      subtitle: "Spec-реклама · AI-фильм · 2:08",
      tags: ["Spec", "AI-видео", "Режиссура", "Цветокоррекция"],
    },
    hero: {
      title: "PUMA Suede — «Молодость»",
      label: "Spec-реклама. Личный проект, не заказ PUMA.",
      role: "Идея, сценарий, режиссура, AI-продакшн, монтаж, цвет — Дмитрий Коломиец",
      sound: "Звук",
      watchFull: "Смотреть полностью",
      close: "Закрыть",
    },
    idea: {
      label: "Идея",
      text: "Молодость не возраст, а состояние. Внук хвастается деду «оригинальными» PUMA Suede и не знает, что дед выиграл в этих самых кроссовках финал 1975 года. Классика не стареет.",
    },
    story: {
      label: "Сюжет",
      items: [
        { img: "story_1", title: "Улица.", text: "Летний Лос-Анджелес, внук и друзья. Голос за кадром о том, что такое молодость.", alt: "Внук и друзья на улице Лос-Анджелеса на закате" },
        { img: "story_2", title: "Барбершоп.", text: "Спор о кроссовках превращается в воспоминание: 1975 год, седьмая игра, четыре секунды до конца.", alt: "Дед и внук в креслах барбершопа" },
        { img: "story_3", title: "Корт.", text: "Дед обыгрывает внука один на один и уходит в его новых кроссовках.", alt: "Дед и внук играют один на один на уличном корте" },
      ],
    },
    process: {
      label: "Процесс",
      steps: [
        { img: "process_1", title: "Раскадровка.", text: "25 кадров с таймингом и репликами до первой генерации.", alt: "Раскадровка ролика из 25 кадров" },
        { img: "process_2", title: "Персонажи.", text: "Листы лица и одежды для деда, внука и друзей и единый мастер-цвет, чтобы герои и свет не менялись от сцены к сцене.", alt: "Листы персонажей: лица и одежда" },
        { img: "process_3", title: "Локация.", text: "Отдельно собранный барбершоп: три одинаковых кресла, фото на стене, улица Лос-Анджелеса за окном.", alt: "Локация барбершопа" },
        { img: "process_4", title: "Анимация.", text: "Сцены по 8–15 секунд с репликами и движением камеры. Последний кадр каждой сцены становится референсом для следующей, поэтому склейки не видны.", alt: "Кадр из анимированной сцены" },
        { img: null, title: "Пост.", text: "Голоса, монтаж, цветокоррекция, плёночное зерно, субтитры, анимация лого.", alt: "Монтаж и цветокоррекция в DaVinci Resolve" },
      ],
    },
    challenges: {
      label: "Сложности и решения",
      items: [
        { title: "Одни и те же лица во всех сценах.", text: "Решение: листы персонажей и опорные кадры как референсы для каждой генерации." },
        { title: "Пространство кадра.", text: "Дед всегда слева, внук справа, даже во фронтальных планах, чтобы зритель не терял, кто где." },
        { title: "Склейки внутри сцены.", text: "Последний кадр предыдущего шота как референс следующего: совпадают свет, поза и положение камеры." },
        { title: "Единый вид.", text: "Общий грейд поверх всех шотов: тёплые света, бирюзовые тени, зерно 35 мм." },
      ],
    },
    grade: {
      label: "До / после",
      caption: "Цветокоррекция и зерно в DaVinci Resolve Studio.",
      before: "До",
      after: "После",
      alt: "Кадр до и после цветокоррекции",
    },
    deliverables: {
      label: "Что сдано",
      items: [
        "Мастер 4K, H.265 10-bit",
        "Версия с английскими субтитрами",
        "Версия с русскими субтитрами",
        "Анимация лого с прозрачностью, 4 варианта",
      ],
      // Hidden until the vertical cut exists
      vertical: "[Вертикальная версия 9:16 — добавлю позже, плашку пока не показывать]",
    },
    tools: {
      label: "Инструменты",
      list: ["Google Flow", "Seedance 2.5", "ElevenLabs", "Topaz", "DaVinci Resolve Studio"],
    },
    timeline: {
      label: "Срок",
      text: "8 дней, 25 октября — 1 ноября 2026. 19 шотов.",
    },
    rights: {
      label: "Права",
      text: "Все персонажи вымышленные, реальные люди не использованы.",
      // Not rendered while it is still a placeholder
      music: "[Музыка: лицензионный трек — название и лицензия.]",
    },
    cta: {
      title: "Нужен такой ролик для вашего бренда?",
      text: "Беру проект от идеи до финального мастера: сценарий, персонажи, анимация, звук, цвет и все форматы под площадки.",
      button: "Обсудить проект",
    },
  },
  en: {
    nav: {
      allWorks: "All work",
      write: "Message",
    },
    card: {
      title: "PUMA Suede — \"Youth\"",
      subtitle: "Spec ad · AI film · 2:08",
      tags: ["Spec", "AI video", "Direction", "Color grading"],
    },
    hero: {
      title: "PUMA Suede — \"Youth\"",
      label: "Spec ad. Personal project, not commissioned by PUMA.",
      role: "Concept, script, direction, AI production, editing, color — Dmitry Kolomiets",
      sound: "Sound on",
      watchFull: "Watch full film",
      close: "Close",
    },
    idea: {
      label: "Idea",
      text: "Youth isn't an age, it's a state of mind. A grandson shows off his \"original\" PUMA Suede to his grandfather, not knowing the old man won the 1975 finals in that very pair. Classics never get old.",
    },
    story: {
      label: "Story",
      items: [
        { img: "story_1", title: "The street.", text: "Summer in Los Angeles, the grandson and his friends. A voice-over on what youth really is.", alt: "Grandson and friends on a Los Angeles street at sunset" },
        { img: "story_2", title: "The barbershop.", text: "An argument about sneakers turns into a memory: 1975, Game 7, four seconds left.", alt: "Grandfather and grandson in barbershop chairs" },
        { img: "story_3", title: "The court.", text: "Grandpa beats his grandson one-on-one and walks off in his new sneakers.", alt: "Grandfather and grandson playing one-on-one on a street court" },
      ],
    },
    process: {
      label: "Process",
      steps: [
        { img: "process_1", title: "Storyboard.", text: "25 frames with timing and dialogue before the first generation.", alt: "25-frame storyboard" },
        { img: "process_2", title: "Characters.", text: "Face and wardrobe sheets for the grandfather, grandson and friends, plus one master color reference, so characters and light stay the same from scene to scene.", alt: "Character sheets: faces and wardrobe" },
        { img: "process_3", title: "Location.", text: "A purpose-built barbershop: three matching chairs, photos on the wall, an LA street outside.", alt: "Barbershop location" },
        { img: "process_4", title: "Animation.", text: "Scenes of 8–15 seconds with dialogue and camera moves. The last frame of each scene becomes the reference for the next one, so the cuts stay invisible.", alt: "Frame from an animated scene" },
        { img: null, title: "Post.", text: "Voices, editing, color grading, film grain, subtitles, logo animation.", alt: "Editing and color grading in DaVinci Resolve" },
      ],
    },
    challenges: {
      label: "Challenges and solutions",
      items: [
        { title: "The same faces in every scene.", text: "Solution: character sheets and key frames as references for each generation." },
        { title: "Screen direction.", text: "Grandpa is always on the left, the grandson on the right, even in frontal shots, so the viewer never loses track of who is where." },
        { title: "Cuts within a scene.", text: "The last frame of the previous shot is the reference for the next: light, pose and camera position match." },
        { title: "One consistent look.", text: "A single grade over all shots: warm highlights, teal shadows, 35 mm grain." },
      ],
    },
    grade: {
      label: "Before / after",
      caption: "Color grading and grain in DaVinci Resolve Studio.",
      before: "Before",
      after: "After",
      alt: "Frame before and after color grading",
    },
    deliverables: {
      label: "Deliverables",
      items: [
        "4K master, H.265 10-bit",
        "Version with English subtitles",
        "Version with Russian subtitles",
        "Logo animation with alpha, 4 variants",
      ],
      vertical: "[Vertical 9:16 version — coming later, don't show this tile yet]",
    },
    tools: {
      label: "Tools",
      list: ["Google Flow", "Seedance 2.5", "ElevenLabs", "Topaz", "DaVinci Resolve Studio"],
    },
    timeline: {
      label: "Timeline",
      text: "8 days, October 25 — November 1, 2026. 19 shots.",
    },
    rights: {
      label: "Rights",
      text: "All characters are fictional, no real people were used.",
      music: "[Music: licensed track — title and license.]",
    },
    cta: {
      title: "Want a film like this for your brand?",
      text: "I take a project from idea to final master: script, characters, animation, sound, color and every format your platforms need.",
      button: "Discuss a project",
    },
  },
} as const
