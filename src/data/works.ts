export interface GalleryItem {
  src: string
  alt: string
  aspect: "landscape" | "portrait" | "square"
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
    image: "/works/carousel/cover.png",
    alt: "AI-карусели для Instagram и Threads — ChatGPT Images",
    year: 2026,
    desc: "Карусели для Instagram и Threads. Консистентный стиль, брендинг, текст — всё через ChatGPT Images.",
    featured: false,
    href: "/works/carousel",
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
