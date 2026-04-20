import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const filePath = url.searchParams.get("path")

  if (!filePath || !filePath.startsWith("/works/")) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  const fullPath = path.join(process.cwd(), "public", filePath)

  try {
    const stats = await stat(fullPath)
    const fileSize = stats.size
    const rangeHeader = req.headers.get("range")

    if (rangeHeader) {
      const [startStr, endStr] = rangeHeader.replace("bytes=", "").split("-")
      const start = parseInt(startStr, 10)
      const end = endStr ? parseInt(endStr, 10) : Math.min(start + 1024 * 1024 - 1, fileSize - 1)
      const chunkSize = end - start + 1

      const { createReadStream } = await import("fs")
      const stream = createReadStream(fullPath, { start, end })

      const webStream = new ReadableStream({
        start(controller) {
          stream.on("data", (chunk) => controller.enqueue(chunk))
          stream.on("end", () => controller.close())
          stream.on("error", (err) => controller.error(err))
        },
      })

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": "video/mp4",
          "Cache-Control": "public, max-age=3600",
        },
      })
    }

    const buffer = await readFile(fullPath)
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Length": String(fileSize),
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch {
    return new NextResponse("Not Found", { status: 404 })
  }
}
