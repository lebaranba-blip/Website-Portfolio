import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Дмитрий — AI & Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#EDEAE4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: "rgba(0,0,0,0.45)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Портфолио
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#0A0A0A",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}
        >
          Дмитрий
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#0891B2",
            fontWeight: 600,
            marginBottom: 40,
          }}
        >
          AI & Design
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(0,0,0,0.55)",
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          AI-визуал, автоматизация и брендинг для бизнеса.
          50+ проектов · 3+ года опыта
        </div>
      </div>
    ),
    { ...size }
  );
}
