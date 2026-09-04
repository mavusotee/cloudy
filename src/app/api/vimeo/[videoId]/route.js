import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  console.log("=================================");
  console.log("VIMEO API ROUTE HIT");
  console.log("=================================");

  try {
    const { videoId } = await params;

    console.log("Video ID:", videoId);
    console.log("Token exists:", !!process.env.VIMEO_ACCESS_TOKEN);

    if (!videoId) {
      return NextResponse.json(
        { error: "Missing video ID" },
        { status: 400 }
      );
    }

    if (!process.env.VIMEO_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          error: "VIMEO_ACCESS_TOKEN is missing",
        },
        { status: 500 }
      );
    }

    const url =
  `https://api.vimeo.com/videos/${videoId}`;

    console.log("Requesting Vimeo:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
        Accept:
          "application/vnd.vimeo.*+json;version=3.4",
      },
      cache: "no-store",
    });

    console.log("Vimeo HTTP status:", response.status);

    const text = await response.text();

    console.log("Vimeo raw response:", text);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Vimeo API error",
          status: response.status,
          details: text,
        },
        { status: response.status }
      );
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Could not parse Vimeo JSON:", error);

      return NextResponse.json(
        {
          error: "Invalid JSON returned by Vimeo",
          details: text,
        },
        { status: 500 }
      );
    }

    console.log("Vimeo files:", data?.files);
    console.log("Vimeo downloads:", data?.download);

    const files = Array.isArray(data?.files)
      ? data.files
      : [];

    if (!files.length) {
      return NextResponse.json(
        {
          error: "Vimeo returned no video files",
          files: [],
          download: data?.download || [],
        },
        { status: 404 }
      );
    }

    // Prefer MP4 files that browsers can play directly.
    const mp4Files = files.filter(
      (file) =>
        file?.type === "video/mp4" &&
        file?.link
    );

    console.log("MP4 files:", mp4Files);

    if (!mp4Files.length) {
      return NextResponse.json(
        {
          error: "Vimeo returned no progressive MP4 files",
          files,
        },
        { status: 404 }
      );
    }

    // Prefer 1080p, then 720p, then the highest available file.
    const preferred =
      mp4Files.find(
        (file) =>
          file.height === 1080 ||
          file.rendition === "1080p"
      ) ||
      mp4Files.find(
        (file) =>
          file.height === 720 ||
          file.rendition === "720p"
      ) ||
      [...mp4Files].sort(
        (a, b) =>
          (b.height || 0) - (a.height || 0)
      )[0];

    console.log("Selected Vimeo file:", preferred);

    return NextResponse.json({
      url: preferred.link,
      type: preferred.type,
      width: preferred.width,
      height: preferred.height,
      rendition: preferred.rendition,
    });
  } catch (error) {
    console.error("=================================");
    console.error("VIMEO ROUTE CRASHED");
    console.error("=================================");
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Vimeo route error",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}