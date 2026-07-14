import Link from "next/link"

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <p
        className="font-black gradient-text"
        style={{
          fontSize: "clamp(4rem, 16vw, 10rem)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontFamily: "var(--font-display), sans-serif",
        }}
      >
        404
      </p>
      <p
        className="font-mono mt-4 mb-10"
        style={{ color: "var(--muted)", fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)" }}
      >
        Такой страницы нет.
      </p>
      <Link href="/" className="btn-primary">
        На главную
      </Link>
    </main>
  )
}
