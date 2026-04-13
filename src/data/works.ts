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
  video?: string
  gallery?: GalleryItem[]
  fullVideo?: string
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
    fullVideo: "/works/gump/ad.mp4",
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
]
