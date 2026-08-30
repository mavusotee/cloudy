"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// =========================================================
// HELPER
// =========================================================

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
};

// =========================================================
// CUSTOM VIDEO PLAYER
// =========================================================

export default function CustomVideoPlayer({
  src,
  title = "",
  isOpen,
  onClose,
}) {
  const overlayRef = useRef(null);
  const playerRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // -------------------------------------------------------
  // OPEN ANIMATION
  // -------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;

    const overlay = overlayRef.current;
    const player = playerRef.current;
    const video = videoRef.current;

    if (!overlay || !player) return;

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.set(overlay, {
        opacity: 0,
      });

      gsap.set(player, {
        opacity: 0,
        scale: 0.88,
        y: 40,
        filter: "blur(18px)",
      });

      const tl = gsap.timeline();

      tl.to(overlay, {
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      }).to(
        player,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.15"
      );

      if (video) {
        video.currentTime = 0;

        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });
        }
      }
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // -------------------------------------------------------
  // CLOSE ANIMATION
  // -------------------------------------------------------

  const closePlayer = useCallback(() => {
    const overlay = overlayRef.current;
    const player = playerRef.current;

    if (!overlay || !player) {
      onClose();
      return;
    }

    gsap
      .timeline({
        onComplete: onClose,
      })
      .to(player, {
        opacity: 0,
        scale: 0.94,
        y: 25,
        filter: "blur(10px)",
        duration: 0.35,
        ease: "power3.in",
      })
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
        },
        "-=0.1"
      );
  }, [onClose]);

  // -------------------------------------------------------
  // ESC KEY
  // -------------------------------------------------------

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePlayer();
      }

      if (
        event.code === "Space" &&
        event.target === document.body
      ) {
        event.preventDefault();

        const video = videoRef.current;

        if (!video) return;

        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closePlayer]);

  // -------------------------------------------------------
  // VIDEO EVENTS
  // -------------------------------------------------------

  const handleLoadedMetadata = () => {
    const video = videoRef.current;

    if (!video) return;

    setDuration(video.duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (!video) return;

    setCurrentTime(video.currentTime);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // -------------------------------------------------------
  // PLAY / PAUSE
  // -------------------------------------------------------

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  // -------------------------------------------------------
  // MUTE
  // -------------------------------------------------------

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // -------------------------------------------------------
  // PROGRESS
  // -------------------------------------------------------

  const handleProgressClick = (event) => {
    const video = videoRef.current;
    const bar = progressRef.current;

    if (!video || !bar || !duration) return;

    const rect = bar.getBoundingClientRect();

    const percentage =
      (event.clientX - rect.left) / rect.width;

    video.currentTime =
      Math.max(0, Math.min(1, percentage)) * duration;
  };

  // -------------------------------------------------------
  // FULLSCREEN
  // -------------------------------------------------------

  const handleFullscreen = () => {
    const player = playerRef.current;

    if (!player) return;

    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }

    player.requestFullscreen?.();
  };

  // -------------------------------------------------------
  // DON'T RENDER
  // -------------------------------------------------------

  if (!isOpen || !src) return null;

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 md:p-8"
      onMouseDown={(event) => {
        if (event.target === overlayRef.current) {
          closePlayer();
        }
      }}
    >
      <div
        ref={playerRef}
        className="relative w-full max-w-[1500px] aspect-video bg-black overflow-hidden shadow-2xl"
      >
        {/* VIDEO */}

        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-contain"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onClick={togglePlay}
        />

        {/* TOP GRADIENT */}

        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

        {/* TOP BAR */}

        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-start justify-between z-10">
          <div className="flex flex-col gap-1">
            <span className="font-geist-mono text-[9px] md:text-[10px] tracking-widest uppercase text-zinc-400">
              Now Playing
            </span>

            <span className="font-geist-mono text-xs md:text-sm uppercase tracking-tight text-white">
              {title}
            </span>
          </div>

          <button
            type="button"
            onClick={closePlayer}
            className="w-9 h-9 md:w-11 md:h-11 border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300"
            aria-label="Close video"
          >
            <span className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>

        {/* CENTER PLAY BUTTON */}

        <button
          type="button"
          onClick={togglePlay}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/60 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 ${
            isPlaying
              ? "opacity-0 hover:opacity-100"
              : "opacity-100"
          }`}
          aria-label={
            isPlaying
              ? "Pause video"
              : "Play video"
          }
        >
          <span className="text-xl ml-1">
            {isPlaying ? "Ⅱ" : "▶"}
          </span>
        </button>

        {/* BOTTOM GRADIENT */}

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

        {/* CONTROLS */}

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">

          {/* PROGRESS */}

          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative w-full h-[2px] bg-white/25 cursor-pointer mb-5 group"
          >
            <div
              className="absolute left-0 top-0 h-full bg-white"
              style={{
                width: `${progress}%`,
              }}
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                left: `${progress}%`,
              }}
            />
          </div>

          {/* CONTROL ROW */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4 md:gap-6">
              <button
                type="button"
                onClick={togglePlay}
                className="font-geist-mono text-[10px] md:text-xs uppercase tracking-widest text-white hover:text-zinc-400 transition-colors"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>

              <span className="font-geist-mono text-[9px] md:text-[10px] text-zinc-400 tracking-wider">
                {formatTime(currentTime)} /{" "}
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <button
                type="button"
                onClick={toggleMute}
                className="font-geist-mono text-[10px] md:text-xs uppercase tracking-widest text-white hover:text-zinc-400 transition-colors"
              >
                {isMuted ? "Sound On" : "Mute"}
              </button>

              <button
                type="button"
                onClick={handleFullscreen}
                className="font-geist-mono text-[10px] md:text-xs uppercase tracking-widest text-white hover:text-zinc-400 transition-colors"
              >
                Fullscreen
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}