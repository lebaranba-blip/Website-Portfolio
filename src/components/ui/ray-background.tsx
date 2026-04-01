"use client"

// Диагональный луч как в рефренсе но с нашими цветами: cyan #0891B2, orange #EA580C, blue #1D4ED8
export default function RayBackground() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              135deg,
              transparent 0%,
              rgba(8, 145, 178, 0.4) 15%,
              rgba(234, 88, 12, 0.5) 50%,
              rgba(29, 78, 216, 0.4) 85%,
              transparent 100%
            )
          `,
          animation: "diagonalRay 6s ease-in-out infinite",
          maskImage: `
            linear-gradient(
              135deg,
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,0.8) 20%,
              rgba(0,0,0,0.8) 80%,
              rgba(0,0,0,0) 100%
            )
          `,
          WebkitMaskImage: `
            linear-gradient(
              135deg,
              rgba(0,0,0,0) 0%,
              rgba(0,0,0,0.8) 20%,
              rgba(0,0,0,0.8) 80%,
              rgba(0,0,0,0) 100%
            )
          `,
          mixBlendMode: "lighten",
          filter: "blur(8px) brightness(1.8)",
        }}
      />

      <style>{`
        @keyframes diagonalRay {
          0% {
            transform: translateX(-100%) translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
