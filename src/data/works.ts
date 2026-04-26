export interface GalleryItem {
  src: string
  alt: string
  aspect: "landscape" | "portrait" | "square"
}

export interface CarouselSet {
  num: string
  label: string
  tone: string
  slides: { src: string; alt: string }[]
}

export interface Work {
  id: string
  title: string
  category: "AI Visual" | "Photo & Video" | "Branding" | "Promo" | "Automation"
  image: string
  alt: string
  year: number
  desc?: string
  featured?: boolean
  href?: string
  video?: string
  gallery?: GalleryItem[]
  fullVideo?: string
  workflow?: string
  carouselSets?: CarouselSet[]
}

export const works: Work[] = [
  {
    id: "gump-donuts",
    title: "Gump Donuts",
    category: "Branding",
    image: "/works/gump/banner.png",
    alt: "Gump Donuts — брендинг пончиков",
    year: 2026,
    desc: "Полный брендинг для сети пончиков. Айдентика, упаковка, мерч, реклама.",
    featured: true,
    href: "/works/gump",
    fullVideo: "/works/gump/ad.mp4",
    workflow: "/Workflow.png",
    gallery: [
      { src: "/works/gump/poster.png", alt: "Постер", aspect: "portrait" },
      { src: "/works/gump/billboard.png", alt: "Билборд", aspect: "landscape" },
      { src: "/works/gump/truck.png", alt: "Фургон", aspect: "landscape" },
      { src: "/works/gump/logo.png", alt: "Логотип", aspect: "square" },
      { src: "/works/gump/boxes.png", alt: "Упаковка", aspect: "landscape" },
      { src: "/works/gump/shopper.png", alt: "Шоппер", aspect: "portrait" },
      { src: "/works/gump/apron.png", alt: "Фартук", aspect: "portrait" },
      { src: "/works/gump/tshirt.png", alt: "Футболка", aspect: "portrait" },
      { src: "/works/gump/tshirt2.png", alt: "Футболки", aspect: "landscape" },
      { src: "/works/gump/lifestyle.png", alt: "Лайфстайл", aspect: "landscape" },
    ],
  },
  {
    id: "ai-carousel",
    title: "AI Карусели",
    category: "AI Visual",
    image: "/works/carousel/s2-banner.png",
    alt: "AI-карусели для Instagram и Threads — ChatGPT Images 2.0",
    year: 2026,
    desc: "3 серии каруселей в разных визуальных системах. Без Figma, без студии — ChatGPT Images 2.0.",
    featured: true,
    href: "/works/carousel",
    carouselSets: [
      {
        num: "01",
        label: "ИИ — уже сейчас",
        tone: "Фиолетовый · 3D-персонажи",
        slides: [
          { src: "/works/carousel/s1-1.png", alt: "ИИ выдаёт всё на одном полотне" },
          { src: "/works/carousel/s1-2.png", alt: "Генерить по одному кадру?" },
          { src: "/works/carousel/s1-3.png", alt: "Сгорают дневные лимиты" },
          { src: "/works/carousel/s1-4.png", alt: "Это касается каждого" },
        ],
      },
      {
        num: "02",
        label: "Боль каруселей в ChatGPT",
        tone: "Чёрный + жёлтый · 3D-объекты",
        slides: [
          { src: "/works/carousel/s2-1.jpg", alt: "Главная боль генерации" },
          { src: "/works/carousel/s2-2.jpg", alt: "ИИ выдаёт одно полотно" },
          { src: "/works/carousel/s2-3.jpg", alt: "Генерить по кадру — жечь лимит" },
          { src: "/works/carousel/s2-4.jpg", alt: "Решение: Nano Banana 2" },
        ],
      },
      {
        num: "03",
        label: "Figma жрала мои выходные",
        tone: "Glitch · Terminal · Claude",
        slides: [
          { src: "/works/carousel/s3-1.jpg", alt: "Figma жрала мои выходные" },
          { src: "/works/carousel/s3-2.jpg", alt: "Что я делал по 8 часов" },
          { src: "/works/carousel/s3-3.jpg", alt: "Два инструмента без Figma" },
          { src: "/works/carousel/s3-4.jpg", alt: "Claude собирает бриф" },
        ],
      },
    ],
  },
  {
    id: "ai-avatar",
    title: "AI Avatar",
    category: "AI Visual",
    image: "/works/ai-avatar/4k.png",
    alt: "AI Avatar — виртуальный персонаж для бизнеса",
    year: 2026,
    desc: "Консистентный AI-персонаж: 360° view, примерка одежды, анимация.",
    featured: true,
    href: "/works/ai-avatar",
    fullVideo: "/works/ai-avatar/video.mp4",
    gallery: [
      { src: "/works/ai-avatar/360-1.png", alt: "Фронт", aspect: "portrait" },
      { src: "/works/ai-avatar/360-2.png", alt: "3/4 влево", aspect: "portrait" },
      { src: "/works/ai-avatar/360-3.png", alt: "Профиль", aspect: "portrait" },
      { src: "/works/ai-avatar/360-4.png", alt: "3/4 вправо", aspect: "portrait" },
      { src: "/works/ai-avatar/360-5.png", alt: "Спина", aspect: "portrait" },
      { src: "/works/ai-avatar/clothes.png", alt: "Раскладка одежды", aspect: "landscape" },
      { src: "/works/ai-avatar/outfit-full.png", alt: "Образ", aspect: "portrait" },
      { src: "/works/ai-avatar/outfit-split.png", alt: "Образ — две позы", aspect: "portrait" },
    ],
  },
]
