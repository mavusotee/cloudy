"use client";
import React from "react";

function VimeoPlayer({ urlOrId, className = "" }) {
  if (!urlOrId) return <div className="bg-zinc-800 w-full h-full" />;

  const vimeoId = urlOrId.includes("vimeo.com")
    ? urlOrId.split("/").pop().split("?")[0]
    : urlOrId;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-zinc-900 ${className}`}>
      <iframe
        // Added &quality=1080p and &dnt=1 to prevent bandwidth throttling
        src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&quality=1080p&dnt=1`}
        className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full h-[56.25vw] min-h-full -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default VimeoPlayer;