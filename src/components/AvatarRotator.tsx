"use client"
import Image from "next/image"

interface RotatorImage {
  src: string
  alt: string
}

interface Props {
  images: RotatorImage[]
  onOpenLightbox?: (index: number) => void
}

export default function AvatarRotator({ images, onOpenLightbox }: Props) {
  return (
    <div className="flex flex-col gap-4 select-none">
      {/* 360° strip — все 5 ракурсов сразу */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            className="relative overflow-hidden rounded-2xl group cursor-zoom-in"
            style={{ aspectRatio: "3/4", background: "var(--surface)" }}
            onClick={() => onOpenLightbox?.(i)}
            aria-label={`Открыть ${img.alt}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.05]"
              quality={82}
              priority={i === 0}
              draggable={false}
              sizes="(max-width: 640px) 20vw, (max-width: 1024px) 15vw, 200px"
            />
            {/* Hover label */}
            <div
              className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(10,10,10,0.55), transparent)" }}
            >
              <span className="text-white font-mono text-[10px] tracking-wide">{img.alt}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Labels row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
        {images.map((img, i) => (
          <p key={i} className="text-center font-mono text-[10px]" style={{ color: "var(--muted)" }}>
            {img.alt}
          </p>
        ))}
      </div>
    </div>
  )
}
