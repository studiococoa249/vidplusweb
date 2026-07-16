import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      return new Response("Invalid protocol", { status: 400 });
    }

    const res = await fetch(targetUrl);
    if (!res.ok) {
      return new Response(`Failed to fetch target URL: ${res.statusText}`, { status: res.status });
    }

    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Headers", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");

    const contentType = res.headers.get("content-type") || "";
    if (contentType) {
      headers.set("Content-Type", contentType);
    }

    const isManifest = targetUrl.endsWith(".m3u8") || targetUrl.includes(".m3u8") || contentType.includes("mpegURL");

    if (isManifest) {
      const text = await res.text();
      const baseUrlObj = new URL(targetUrl);
      const basePath = baseUrlObj.href.substring(0, baseUrlObj.href.lastIndexOf("/") + 1);

      const lines = text.split("\n");
      const rewrittenLines = lines.map((line) => {
        let currentLine = line;

        // Rewrite encryption keys in the manifest if any exist
        if (currentLine.includes("#EXT-X-KEY")) {
          const keyRegex = /URI="([^"]+)"/;
          const match = currentLine.match(keyRegex);
          if (match) {
            const relativeKeyUrl = match[1];
            const absoluteKeyUrl = relativeKeyUrl.startsWith("http")
              ? relativeKeyUrl
              : new URL(relativeKeyUrl, basePath).href;
            const proxiedKeyUrl = `/api/hls-proxy?url=${encodeURIComponent(absoluteKeyUrl)}`;
            currentLine = currentLine.replace(keyRegex, `URI="${proxiedKeyUrl}"`);
          }
        }

        const trimmed = currentLine.trim();
        // Rewrite segment paths to go through proxy
        if (trimmed && !trimmed.startsWith("#")) {
          const absoluteSegmentUrl = trimmed.startsWith("http")
            ? trimmed
            : new URL(trimmed, basePath).href;
          return `/api/hls-proxy?url=${encodeURIComponent(absoluteSegmentUrl)}`;
        }

        return currentLine;
      });

      const rewrittenContent = rewrittenLines.join("\n");
      const encoder = new TextEncoder();
      const data = encoder.encode(rewrittenContent);

      return new Response(data, {
        status: 200,
        headers,
      });
    }

    let data = await res.arrayBuffer();

    // Check if the file starts with the "shortmax00" obfuscation signature
    if (data.byteLength > 2168) {
      const uint8Data = new Uint8Array(data);
      const signature = "shortmax00";
      let isObfuscated = true;
      for (let i = 0; i < signature.length; i++) {
        if (uint8Data[i] !== signature.charCodeAt(i)) {
          isObfuscated = false;
          break;
        }
      }

      if (isObfuscated) {
        // Strip the 2168-byte junk header to restore the standard MPEG-TS segment
        data = data.slice(2168);
      }
    }

    return new Response(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("HLS proxy error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
