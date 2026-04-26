import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 92],
    deviceSizes: [640, 1080, 1440, 1920, 2560],
    imageSizes: [320, 480, 640, 800, 1200],
  },
  // Allow large static files (videos up to 100MB)
  experimental: {
    largePageDataBytes: 128 * 1000 * 1000,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self';" },
        ],
      },
    ]
  },
};

export default nextConfig;
