"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navigation from "@/components/UI/Navigation";
import HeroCanvas from "@/components/react-three/HeroCanvas";
import { useParams } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { client } from "@/lib/client";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// =========================================================
// PARALLAX MEDIA WRAPPER
// =========================================================

function ParallaxMedia({ children, speed = -20, className = "" }) {
  const containerRef = useRef(null);
  const mediaRef = useRef(null);

  useGSAP(
    () => {
      if (!containerRef.current || !mediaRef.current) return;

      gsap.fromTo(
        mediaRef.current,
        {
          yPercent: -speed,
        },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [speed] }
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full bg-zinc-950 border border-zinc-900/80 ${className}`}
    >
      <div
        ref={mediaRef}
        className="relative w-full h-[120%] -top-[10%] will-change-transform transform-gpu"
      >
        {children}
      </div>
    </div>
  );
}

// =========================================================
// SANITY QUERY
// =========================================================

const PROJECT_QUERY = `
  *[
    _type == "caseStudy" &&
    slug.current == $slug
  ][0]{
    _id,
    title,
    client,
    overview,
    date,
    services,

    heroVideos[]{
      _key,
      "src": asset->url
    },

    gallery[]{
      _key,
      "src": asset->url,
      "mimeType": asset->mimeType
    }
  }
`;

// =========================================================
// MEDIA URL HELPER
// =========================================================

const getMediaUrl = (media) => {
  if (!media) return null;
  if (typeof media === "string") return media;
  if (typeof media.src === "string") return media.src;
  if (typeof media.url === "string") return media.url;
  return null;
};

// =========================================================
// EDITORIAL GRID PRESETS
// =========================================================

export const EDITORIAL_PRESETS = [
  // Item 1: Dominant Portrait (Faster upward scroll)
  {
    colSpan: "md:col-span-6 md:col-start-7",
    aspect: "aspect-[3/4]",
    offset: "md:mb-32",
    sizes: "(max-width: 768px) 100vw, 50vw",
    speed: -25,
  },
  // Item 2: Narrow Left Accent (Lagging scroll effect)
  {
    colSpan: "md:col-span-4 md:col-start-1",
    aspect: "aspect-[9/16]",
    offset: "md:translate-y-24 md:mb-48",
    sizes: "(max-width: 768px) 100vw, 33vw",
    speed: 15,
  },
  // Item 3: Medium Portrait
  {
    colSpan: "md:col-span-5 md:col-start-2",
    aspect: "aspect-[4/5]",
    offset: "md:mb-36",
    sizes: "(max-width: 768px) 100vw, 42vw",
    speed: -18,
  },
  // Item 4: Tall Right Focus (Deep displacement)
  {
    colSpan: "md:col-span-5 md:col-start-8",
    aspect: "aspect-[9/16]",
    offset: "md:translate-y-16 md:mb-40",
    sizes: "(max-width: 768px) 100vw, 42vw",
    speed: -30,
  },
  // Item 5: Centerpiece Portrait
  {
    colSpan: "md:col-span-7 md:col-start-3",
    aspect: "aspect-[3/4]",
    offset: "md:mb-32",
    sizes: "(max-width: 768px) 100vw, 58vw",
    speed: -12,
  },
  // Item 6: Left Column Anchor
  {
    colSpan: "md:col-span-5 md:col-start-1",
    aspect: "aspect-[4/5]",
    offset: "md:mb-28",
    sizes: "(max-width: 768px) 100vw, 42vw",
    speed: 20,
  },
];

// =========================================================
// EXTRUDED TEXT REVEAL
// =========================================================

function ExtrudedTextReveal({ text }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current || !text) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(textRef.current, {
        type: "lines,words,chars",
        linesClass: "sky-line relative block overflow-hidden py-[0.05em]",
        wordsClass: "sky-word relative inline-block whitespace-nowrap",
        charsClass:
          "sky-char relative inline-block will-change-[transform,opacity,filter] transform-gpu",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        split.chars,
        {
          opacity: 0,
          yPercent: 120,
          scaleY: 0.1,
          scaleX: 0.9,
          filter: "blur(10px)",
          transformOrigin: "50% 100%",
          force3D: true,
        },
        {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          filter: "blur(0px)",
          stagger: 0.008,
          duration: 0.8,
          force3D: true,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text]);

  return (
    <div ref={containerRef} className="w-full">
      <h1
        ref={textRef}
        className="text-3xl md:text-7xl text-ghost-white tracking-tight"
      >
        {text}
      </h1>
    </div>
  );
}

// =========================================================
// PAGE
// =========================================================

export default function CloudhausWorkDetail() {
  const params = useParams();

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : null;

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchProject() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await client.fetch(
          PROJECT_QUERY,
          { slug },
          { next: { revalidate: 60 } }
        );

        if (cancelled) return;

        if (!data) {
          setProject(null);
          return;
        }

        setProject(data);
      } catch (err) {
        console.error("Failed to fetch Sanity project:", err);
        if (!cancelled) {
          setProject(null);
          setError("Unable to load project.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProject();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const heroVideos = Array.isArray(project?.heroVideos)
    ? project.heroVideos
        .map((video) => ({
          ...video,
          src: getMediaUrl(video),
        }))
        .filter((video) => video.src)
    : [];

  const totalVideos = heroVideos.length;
  const activeSrc = heroVideos[currentVideoIndex]?.src || null;
  const nextSrc =
    nextVideoIndex !== null ? heroVideos[nextVideoIndex]?.src || null : null;

  useEffect(() => {
    setCurrentVideoIndex(0);
    setNextVideoIndex(null);
    setIsTransitioning(false);
  }, [project]);

  const handleNext = () => {
    if (isTransitioning || totalVideos <= 1) return;
    const nextIndex =
      currentVideoIndex + 1 >= totalVideos ? 0 : currentVideoIndex + 1;
    setNextVideoIndex(nextIndex);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    if (nextVideoIndex === null) return;
    setCurrentVideoIndex(nextVideoIndex);
    setNextVideoIndex(null);
    setIsTransitioning(false);
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-geist-mono text-sm uppercase tracking-widest">
          Loading project
        </p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="font-geist-mono text-sm uppercase tracking-widest">
            Project not found
          </p>
          {error && (
            <p className="font-geist-mono text-[10px] text-zinc-600 uppercase">
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }

  const gallery = Array.isArray(project.gallery)
    ? project.gallery
        .map((item) => ({
          ...item,
          src: getMediaUrl(item),
        }))
        .filter((item) => item.src)
    : [];

  const services = Array.isArray(project.services)
    ? project.services.filter(
        (service) => typeof service === "string" && service.trim().length > 0
      )
    : [];

  return (
    <main className="min-h-dvh bg-black text-zinc-300 font-geist-mono selection:bg-white selection:text-black">
      <div className="relative w-full bg-black">
        <div className="sticky top-0 w-full h-dvh overflow-hidden z-0">
          {activeSrc && (
            <HeroCanvas
              activeSrc={activeSrc}
              nextSrc={nextSrc}
              isTransitioning={isTransitioning}
              onTransitionComplete={handleTransitionComplete}
            />
          )}
          <div className="absolute inset-0 z-[1] bg-black/40 pointer-events-none" />
        </div>

        <div className="relative z-10 -mt-[100vh] w-full">
          <div className="h-dvh w-full flex flex-col justify-between p-4 md:p-8">
            <div className="z-[1000]">
              <Navigation />
            </div>

            <div className="w-full pb-4 md:pb-6">
              <div className="flex items-end justify-between w-full select-none">
                <div className="flex flex-col space-y-2 font-sans tracking-tight">
                  <ExtrudedTextReveal text={project.title || ""} />
                  {totalVideos > 1 && (
                    <span className="text-[10px] md:text-xs text-zinc-400 font-geist-mono tracking-widest">
                      {String(currentVideoIndex + 1).padStart(2, "0")} /{" "}
                      {String(totalVideos).padStart(2, "0")}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isTransitioning || totalVideos <= 1}
                  aria-label="Next project video"
                  className={`bg-black border border-eclipse text-2xl w-[3.5rem] h-[4rem] flex items-center justify-center text-center transition-opacity duration-300 ${
                    isTransitioning || totalVideos <= 1
                      ? "opacity-40 cursor-not-allowed"
                      : "opacity-100 cursor-pointer"
                  }`}
                >
                  <span className="text-2xl leading-none">→</span>
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 md:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-[11px] leading-relaxed uppercase tracking-wider text-zinc-300 font-geist-mono">
              <div className="md:col-span-7 space-y-4">
                <h2 className="text-white md:text-lg">PROJECT OVERVIEW</h2>
                <p className="max-w-xl text-zinc-300 text-sm font-normal leading-5 uppercase">
                  {project.overview || "NO PROJECT OVERVIEW AVAILABLE."}
                </p>
              </div>

              <div className="md:col-span-5 space-y-4">
                <h2 className="text-white md:text-lg">WHAT WE DID:</h2>
                {services.length > 0 ? (
                  <ul className="space-y-1 text-zinc-300 text-sm uppercase">
                    {services.map((service, index) => (
                      <li key={`${service}-${index}`}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 text-sm">—</p>
                )}
              </div>

              <div className="md:col-span-5 space-y-2 pt-2">
                <h2 className="text-white md:text-lg">CLIENT</h2>
                <p className="text-zinc-300 text-sm uppercase">
                  {project.client || "—"}
                </p>
              </div>

              <div className="md:col-span-5 space-y-2 pt-2">
                <h2 className="text-white md:text-lg">DATE</h2>
                <p className="text-zinc-300 text-sm uppercase">
                  {project.date || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          GALLERY SECTION WITH PARALLAX WRAPPER
      ================================================= */}

      <section className="relative z-20 mx-auto px-2 pb-8 md:px-16 pt-20 md:pt-40 bg-black overflow-hidden">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-y-0 md:gap-x-8 items-start">
            {gallery.map((item, index) => {
              const src = item.src;
              const isVideo = item.mimeType?.startsWith("video/");
              const layout =
                EDITORIAL_PRESETS[index % EDITORIAL_PRESETS.length];

              return (
                <div
                  key={item._key || `gallery-${index}`}
                  className={`flex flex-col space-y-3 group ${layout.colSpan} ${layout.offset}`}
                >
                  <ParallaxMedia
                    speed={layout.speed}
                    className={layout.aspect}
                  >
                    {isVideo ? (
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500 ease-out"
                        onError={() =>
                          console.error("Failed to load gallery video:", src)
                        }
                      />
                    ) : (
                      <Image
                        src={src}
                        alt={`${project.title || "Project"} media ${
                          index + 1
                        }`}
                        fill
                        priority={index < 2}
                        sizes={layout.sizes}
                        quality={100}
                        className="object-cover brightness-90 group-hover:brightness-100 transition-all duration-500 ease-out"
                        onError={() =>
                          console.error("Failed to load gallery image:", src)
                        }
                      />
                    )}
                  </ParallaxMedia>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-32">
            <p className="font-geist-mono text-xs uppercase tracking-widest text-zinc-700">
              No gallery media
            </p>
          </div>
        )}
      </section>
    </main>
  );
}