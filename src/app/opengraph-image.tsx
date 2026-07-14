import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Дмитрий Коломиец — AI Production";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          background: "linear-gradient(135deg, #0B0B0D 0%, #17171A 45%, #22D3EE 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay для читаемости */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(10, 10, 10, 0.35)",
            pointerEvents: "none",
          }}
        />

        {/* Светлые акцентные элементы */}
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            top: -100,
            right: -100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            bottom: -50,
            left: -50,
          }}
        />

        {/* Контент */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.7)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 32,
              fontWeight: 500,
            }}
          >
            Портфолио
          </div>
          <div
            style={{
              fontSize: 100,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Дмитрий Коломиец
          </div>
          <div
            style={{
              fontSize: 48,
              color: "rgba(255, 255, 255, 0.95)",
              fontWeight: 600,
              marginBottom: 48,
              letterSpacing: "-0.01em",
            }}
          >
            AI Production
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: 700,
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Коммерческое AI-видео и визуал полного цикла.
            <br />
            Сценарий → генерация → монтаж → цвет
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
