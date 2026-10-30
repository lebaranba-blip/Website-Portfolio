export const valterDict = {
  ru: {
    nav: {
      allWorks: "Все работы",
      write: "Написать",
    },
    hero: {
      eyebrow: "AI Video · UGC · 2026",
      title1: "Valter",
      title2: "Хук на автобане",
      subtitle: "Вертикальный UGC-ролик на 45 секунд для рынка Великобритании. Я придумал героя, переписал сценарий под британцев, сгенерировал все сцены и сделал моушн-графику.",
      meta: [
        { label: "Бренд", value: "Valter" },
        { label: "Формат", value: "9:16, 45 с" },
        { label: "Рынок", value: "Великобритания" },
        { label: "Моя роль", value: "Персонаж, сценарий, видео, моушн" },
      ],
      playerLabel: "Финальный ролик",
    },
    task: {
      label: "Задача",
      heading1: "ЧУЖАЯ МЕХАНИКА,",
      heading2: "БРИТАНСКИЙ ВКУС",
      intro: "На входе был рабочий перформанс-ролик с индийским антуражем. Механику нужно было сохранить, а всё остальное перенести в Британию: героя, локацию, юмор и банк.",
      beats: [
        { time: "0–15 с", title: "Хук и пруф", text: "За спиной героя происходит что-то дикое, а он спокойно показывает на телефоне, что £12 500 уже пришли." },
        { time: "15–45 с", title: "Лицо бренда", text: "Основатель в кабинете закрывает главные возражения: дойдут ли деньги, сколько будет проверок, не заблокирует ли банк перевод." },
      ],
    },
    character: {
      label: "Персонаж",
      heading1: "АРТУР",
      heading2: "УИТФИЛД",
      intro: "Героя я сгенерировал с нуля и собрал на него character sheet: анфас, профиль, затылок, полный рост и раскладку одежды. По этим ракурсам модель держит одно лицо во всех сценах.",
      traits: ["Южноанглийский акцент", "Словечки brisk, faff, quite", "Невозмутимая подача", "Фирменное поло Valter"],
      voice: "Акцент и разговорные словечки я заложил специально. Нейтральный голос за кадром звучит как реклама, а Артур звучит как живой человек.",
      shots: [
        { src: "char-front", alt: "Анфас" },
        { src: "char-profile", alt: "Профиль" },
        { src: "char-back", alt: "Затылок" },
        { src: "char-full", alt: "Полный рост" },
        { src: "outfit", alt: "Раскладка одежды" },
        { src: "location", alt: "Локация: британский автобан" },
      ],
    },
    idea: {
      label: "Идея",
      heading1: "ЧТО ВЗЯЛ,",
      heading2: "ЧТО ПОМЕНЯЛ",
      columns: [
        {
          title: "Из референса",
          items: [
            "Контраст: за спиной героя происходит что-то экстремальное",
            "Мгновенный пруф: перевод виден прямо на экране телефона",
          ],
        },
        {
          title: "Под Британию",
          items: [
            "Обочина автобана, плотный трафик, зелёные указатели",
            "Вместо прямой опасности — двухэтажный автобус и две Lamborghini на скорости",
            "Monzo и Faster Payments вместо банка из оригинала",
          ],
        },
        {
          title: "От себя",
          items: [
            "Свой герой с character sheet",
            "Локация, которой не было в референсе",
            "Акцент и британские словечки в речи",
            "Lower third на Remotion",
          ],
        },
      ],
    },
    scenes: {
      label: "Сцены",
      heading1: "НИ ОДНОГО",
      heading2: "СЪЁМОЧНОГО ДНЯ",
      intro: "Каждый кадр ролика сгенерирован в Seedance 2.5: автобан, кабинет, видеозвонок, улица, экран телефона. Стоков и съёмок нет.",
      items: [
        { src: "scene-motorway", caption: "Автобан" },
        { src: "scene-office", caption: "Кабинет основателя" },
        { src: "scene-call", caption: "Видеозвонок в поддержку" },
        { src: "scene-payout", caption: "Экран с переводом" },
        { src: "scene-street", caption: "Улица" },
        { src: "scene-reaction", caption: "Реакция" },
      ],
    },
    motion: {
      label: "Моушн",
      heading1: "LOWER THIRD",
      heading2: "НА КОДЕ",
      text: "Когда Артур представляется, слева выезжают две плашки: чёрная с именем и синяя с подписью. Я собрал их покадрово в Remotion через interpolate и easing и отрендерил с прозрачным фоном, чтобы положить поверх видео.",
      caption: "Плашка отдельно, прозрачный фон",
    },
    stack: {
      label: "Стек",
      list: ["Seedance 2.5", "Nano Banana", "Remotion"],
    },
    video: {
      soundOn: "Включить звук",
      soundOff: "Выключить звук",
    },
    cta: {
      title1: "Нужен",
      title2: " UGC‑ролик?",
      desc: "Придумаю героя под ваш бренд и соберу ролик без актёров, локаций и съёмочной группы.",
      primaryButton: "Написать в Telegram",
      ghostButton: "Все работы",
    },
  },
  en: {
    nav: {
      allWorks: "All work",
      write: "Message",
    },
    hero: {
      eyebrow: "AI Video · UGC · 2026",
      title1: "Valter",
      title2: "The Motorway Hook",
      subtitle: "A 45-second vertical UGC ad for the UK market. I created the presenter, rewrote the script for a British audience, generated every scene and built the motion graphics.",
      meta: [
        { label: "Brand", value: "Valter" },
        { label: "Format", value: "9:16, 45 s" },
        { label: "Market", value: "United Kingdom" },
        { label: "My role", value: "Character, script, video, motion" },
      ],
      playerLabel: "Final ad",
    },
    task: {
      label: "Brief",
      heading1: "BORROWED MECHANIC,",
      heading2: "BRITISH TASTE",
      intro: "The starting point was a proven performance ad set in India. The mechanic had to stay; everything else moved to Britain: the presenter, the location, the humour and the bank.",
      beats: [
        { time: "0–15 s", title: "Hook and proof", text: "Something wild happens behind the presenter while he calmly shows £12,500 already landed on his phone." },
        { time: "15–45 s", title: "Face of the brand", text: "The founder, at his desk, answers the big objections: will the money arrive, how many checks, will the bank block it." },
      ],
    },
    character: {
      label: "Character",
      heading1: "ARTHUR",
      heading2: "WHITFIELD",
      intro: "I generated the presenter from scratch and built a character sheet: front, profile, back of the head, full body and the outfit flat-lay. Those angles keep the same face in every scene.",
      traits: ["Southern English accent", "Words like brisk, faff, quite", "Deadpan delivery", "Valter polo"],
      voice: "The accent and the slang are deliberate. A neutral voiceover sounds like an ad; Arthur sounds like a real person.",
      shots: [
        { src: "char-front", alt: "Front" },
        { src: "char-profile", alt: "Profile" },
        { src: "char-back", alt: "Back" },
        { src: "char-full", alt: "Full body" },
        { src: "outfit", alt: "Outfit flat-lay" },
        { src: "location", alt: "Location: UK motorway" },
      ],
    },
    idea: {
      label: "Idea",
      heading1: "WHAT I KEPT,",
      heading2: "WHAT I CHANGED",
      columns: [
        {
          title: "From the reference",
          items: [
            "Contrast: something extreme happens behind the presenter",
            "Instant proof: the transfer is right there on the phone screen",
          ],
        },
        {
          title: "Made British",
          items: [
            "Motorway hard shoulder, heavy traffic, green road signs",
            "Instead of plain danger, a double-decker and two Lamborghinis flying past",
            "Monzo and Faster Payments instead of the original bank",
          ],
        },
        {
          title: "My additions",
          items: [
            "An original presenter with a character sheet",
            "A location the reference didn't have",
            "Accent and British slang in the script",
            "A Remotion lower third",
          ],
        },
      ],
    },
    scenes: {
      label: "Scenes",
      heading1: "NOT A SINGLE",
      heading2: "SHOOT DAY",
      intro: "Every frame was generated in Seedance 2.5: the motorway, the office, a video call, the street, the phone screen. No stock, no shoot.",
      items: [
        { src: "scene-motorway", caption: "Motorway" },
        { src: "scene-office", caption: "Founder's office" },
        { src: "scene-call", caption: "Support video call" },
        { src: "scene-payout", caption: "Transfer on screen" },
        { src: "scene-street", caption: "Street" },
        { src: "scene-reaction", caption: "Reaction" },
      ],
    },
    motion: {
      label: "Motion",
      heading1: "LOWER THIRD",
      heading2: "IN CODE",
      text: "When Arthur introduces himself, two bars slide in from the left: a black one with his name and a blue one with the tagline. I animated them frame by frame in Remotion with interpolate and easing, and rendered them with a transparent background to sit on top of the video.",
      caption: "The bars on their own, transparent background",
    },
    stack: {
      label: "Stack",
      list: ["Seedance 2.5", "Nano Banana", "Remotion"],
    },
    video: {
      soundOn: "Sound on",
      soundOff: "Sound off",
    },
    cta: {
      title1: "Need a",
      title2: " UGC ad?",
      desc: "I'll design a presenter for your brand and build the ad without actors, locations or a crew.",
      primaryButton: "Message on Telegram",
      ghostButton: "All work",
    },
  },
} as const
