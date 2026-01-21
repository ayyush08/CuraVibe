import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url, {
      // Important for Google/GitHub avatars
      headers: {
        "User-Agent": "Mozilla/5.0"
      },
      // Avoid caching auth images incorrectly
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") ?? "image/png";

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        // Needed when COEP / crossOriginIsolated is enabled
        "Cross-Origin-Resource-Policy": "cross-origin",
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
