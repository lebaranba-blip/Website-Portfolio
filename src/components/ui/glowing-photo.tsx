"use client"

interface GlowingPhotoProps {
  src: string
  alt: string
  width?: number
  height?: number
}

export function GlowingPhoto({ src, alt, width = 200, height = 240 }: GlowingPhotoProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: "20px",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
      />
    </div>
  )
}
