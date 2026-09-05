import { NextResponse } from "next/server";

// Ensure the folder name matching this dynamic route is [videoId]
export async function GET(request, { params }) {
  console.log("=================================");
  console.log("VIMEO API ROUTE HIT");
  console.log("=================================");

  try {
    // Next.js 15 requires awaiting params
    const resolvedParams = await params;
    const videoId = resolvedParams?.videoId; 

    console.log("Video ID:", videoId);
    console.log("Token exists:", !!process.env.VIMEO_ACCESS_TOKEN);

    if (!videoId) {
      return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
    }

    if (!process.env.VIMEO_ACCESS_TOKEN) {
      return NextResponse.json({ error: "VIMEO_ACCESS_TOKEN is missing" }, { status: 500 });
    }

    // Explicitly ask for required fields to keep the response lean
    const url = `https://api.vimeo.com/videos/${videoId}?fields=uri,name,play,files,download`;

    console.log("Requesting Vimeo:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`, // Capitalized 'Bearer' for standard compliance
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      next: { revalidate: 0 }, // Preferred Next.js way to completely bypass cache
    });

    console.log("Vimeo HTTP status:", response.status);
    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Vimeo API error", status: response.status, details: text },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      return NextResponse.json({ error: "Invalid JSON returned by Vimeo", details: text }, { status: 500 });
    }

    // --- Helper function to find the best quality MP4 file ---
    const extractBestMp4 = (fileArray) => {
      if (!Array.isArray(fileArray)) return null;
      
      const mp4Files = fileArray.filter(file => file?.type === "video/mp4" && file?.link);
      if (mp4Files.length === 0) return null;

      return (
        mp4Files.find(file => file.height === 1080 || file.rendition === "1080p") ||
        mp4Files.find(file => file.height === 720 || file.rendition === "720p") ||
        [...mp4Files].sort((a, b) => (b.height || 0) - (a.height || 0))[0]
      );
    };

    // OPTION 1: Vimeo "files"
    const preferredFile = extractBestMp4(data?.files);
    if (preferredFile) {
      return NextResponse.json({
        url: preferredFile.link,
        type: preferredFile.type,
        width: preferredFile.width,
        height: preferredFile.height,
        rendition: preferredFile.rendition,
        source: "files",
      });
    }

    // OPTION 2: Vimeo "play.progressive"
    const preferredProgressive = extractBestMp4(data?.play?.progressive);
    if (preferredProgressive) {
      return NextResponse.json({
        url: preferredProgressive.link,
        type: preferredProgressive.type,
        width: preferredProgressive.width,
        height: preferredProgressive.height,
        rendition: preferredProgressive.rendition,
        source: "play.progressive",
      });
    }

    // NOTHING AVAILABLE (Likely permission/token scope problem)
    console.error("Vimeo returned no playable MP4 files.");
    return NextResponse.json(
      {
        error: "Vimeo returned no playable video files. Ensure your token has 'video_files' scope and account is Pro/Premium.",
        debug: {
          hasPlay: !!data?.play,
          hasProgressive: !!data?.play?.progressive,
          filesCount: data?.files?.length || 0,
          downloadCount: data?.download?.length || 0,
          responseKeys: Object.keys(data || {}),
        },
      },
      { status: 404 }
    );

  } catch (error) {
    console.error("=================================");
    console.error("VIMEO ROUTE CRASHED", error);
    console.error("=================================");
    return NextResponse.json(
      { error: "Internal Vimeo route error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}