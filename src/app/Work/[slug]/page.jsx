"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Navigation from "@/components/UI/Navigation";
import HeroCanvas from "@/components/react-three/HeroCanvas";
import WorkControls from "@/components/UI/WorkControls";

import { useParams } from "next/navigation";

import Lenis from "lenis";

import { client } from "@/lib/client";

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
  if (!media) {
    return null;
  }

  if (typeof media === "string") {
    return media;
  }

  if (typeof media.src === "string") {
    return media.src;
  }

  if (typeof media.url === "string") {
    return media.url;
  }

  return null;
};

// =========================================================
// EDITORIAL GRID PRESETS (STRICTLY PORTRAIT)
// =========================================================

const EDITORIAL_PRESETS = [
  {
    colSpan: "md:col-span-7 md:col-start-6",
    aspect: "aspect-[4/5]",
    offset: "md:mb-36",
  },
  {
    colSpan: "md:col-span-4 md:col-start-1",
    aspect: "aspect-[9/16]",
    offset: "md:-mt-24 md:mb-32",
  },
  {
    colSpan: "md:col-span-5 md:col-start-7",
    aspect: "aspect-[3/4]",
    offset: "md:mb-40",
  },
  {
    colSpan: "md:col-span-8 md:col-start-3",
    aspect: "aspect-[3/4]",
    offset: "md:mb-36",
  },
  {
    colSpan: "md:col-span-4 md:col-start-2",
    aspect: "aspect-[9/16]",
    offset: "md:-mt-16 md:mb-28",
  },
  {
    colSpan: "md:col-span-6 md:col-start-7",
    aspect: "aspect-[4/5]",
    offset: "md:mb-32",
  },
];

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
    nextVideoIndex !== null
      ? heroVideos[nextVideoIndex]?.src || null
      : null;

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
      easing: (t) =>
        Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let frameId;

    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
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

      {/* =================================================
          STICKY BACKGROUND & SCROLLABLE HERO WRAPPER
      ================================================= */}
      <div className="relative w-full bg-black">

        {/* 3D CANVAS BACKGROUND (STICKY) */}
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

        {/* CONTENT OVERLAY (SCROLLS OVER CANVAS) */}
        <div className="relative z-10 -mt-[100vh] w-full">
          
          {/* SCREEN 1: STRICTLY 100VH FLEX CONTAINER */}
          <div className="h-dvh w-full flex flex-col justify-between p-4 md:p-8">
            
            {/* TOP NAVIGATION */}
            <div>
              <Navigation />
            </div>

            {/* TITLE & CONTROLS AT BOTTOM EDGE OF FIRST SCREEN */}
            <div className="w-full pb-4 md:pb-6">
              <WorkControls
                client={project.client || ""}
                title={project.title || ""}
                onNext={handleNext}
                disabled={isTransitioning || totalVideos <= 1}
                currentVideo={totalVideos > 0 ? currentVideoIndex + 1 : 0}
                totalVideos={totalVideos}
              />
            </div>
          </div>

          {/* SCREEN 2: PROJECT OVERVIEW (BELOW THE FOLD, VISIBLE ON SCROLL) */}
          <div className="px-4 md:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-[11px] leading-relaxed uppercase tracking-wider text-zinc-300 font-geist-mono">

              {/* OVERVIEW */}
              <div className="md:col-span-7 space-y-4">
                <h2 className="text-white md:text-lg">
                  PROJECT OVERVIEW
                </h2>
                <p className="max-w-xl text-zinc-300 text-sm font-normal leading-5 uppercase">
                  {project.overview || "NO PROJECT OVERVIEW AVAILABLE."}
                </p>
              </div>

              {/* SERVICES */}
              <div className="md:col-span-5 space-y-4">
                <h2 className="text-white md:text-lg">
                  WHAT WE DID:
                </h2>

                {services.length > 0 ? (
                  <ul className="space-y-1 text-zinc-300 text-sm uppercase">
                    {services.map((service, index) => (
                      <li key={`${service}-${index}`}>
                        {service}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-zinc-600 text-sm">
                    —
                  </p>
                )}
              </div>

              {/* DATE */}
              <div className="md:col-span-5 space-y-2 pt-2">
                <h2 className="text-white md:text-lg">
                  DATE
                </h2>
                <p className="text-zinc-300 text-sm uppercase">
                  {project.date || "—"}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* =================================================
          GALLERY
      ================================================= */}

      <section className="relative z-20 mx-auto px-6 pb-48 md:px-16 pt-20 md:pt-40 bg-black overflow-hidden">
        {gallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-y-0 md:gap-x-8 items-start">
            {gallery.map((item, index) => {
              const number = String(index + 1).padStart(2, "0");
              const src = item.src;
              const isVideo = item.mimeType?.startsWith("video/");
              const layout = EDITORIAL_PRESETS[index % EDITORIAL_PRESETS.length];

              return (
                <div
                  key={item._key || `gallery-${index}`}
                  className={`flex flex-col space-y-3 group ${layout.colSpan} ${layout.offset}`}
                >
                  <span className="text-[10px] text-zinc-500 font-geist-mono tracking-widest uppercase">
                    /{number}
                  </span>

                  <div className={`relative ${layout.aspect} w-full overflow-hidden bg-zinc-950 border border-zinc-900/80`}>
                    {isVideo ? (
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500 ease-out"
                        onError={() => {
                          console.error("Failed to load gallery video:", src);
                        }}
                      />
                    ) : (
                      <img
                        src={src}
                        alt={`${project.title || "Project"} media ${index + 1}`}
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-500 ease-out"
                        onError={() => {
                          console.error("Failed to load gallery image:", src);
                        }}
                      />
                    )}
                  </div>
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