"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Navigation from "@/components/UI/Navigation";
import HeroCanvas from "@/components/react-three/HeroCanvas";
import WorkControls from "@/components/UI/WorkControls";

import { useParams } from "next/navigation";

import Lenis from "lenis";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { client } from "@/lib/client";

gsap.registerPlugin(ScrollTrigger);

// =========================================================
// SANITY QUERY
// =========================================================
//
// heroVideos = array of Sanity "file"
// gallery    = array containing:
//              - Sanity "image"
//              - Sanity "file" (video)
//
// We return the asset URL and the Sanity item type.
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

  // Already a URL string
  if (typeof media === "string") {
    return media;
  }

  // Our GROQ query returns { src: "..." }
  if (typeof media.src === "string") {
    return media.src;
  }

  // Fallback
  if (typeof media.url === "string") {
    return media.url;
  }

  return null;
};

// =========================================================
// PAGE
// =========================================================

export default function CloudhausWorkDetail() {
  const params = useParams();

  // =======================================================
  // SLUG
  // =======================================================

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : null;

  // =======================================================
  // PROJECT STATE
  // =======================================================

  const [project, setProject] = useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  // =======================================================
  // FETCH PROJECT FROM SANITY
  // =======================================================

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
          {
            slug,
          },
          {
            next: {
              revalidate: 60,
            },
          }
        );

        if (cancelled) {
          return;
        }

        if (!data) {
          setProject(null);
          return;
        }

        console.log(
          "SANITY PROJECT:",
          data
        );

        console.log(
          "SANITY GALLERY:",
          data.gallery
        );

        console.log(
          "SANITY HERO VIDEOS:",
          data.heroVideos
        );

        setProject(data);
      } catch (err) {
        console.error(
          "Failed to fetch Sanity project:",
          err
        );

        if (!cancelled) {
          setProject(null);

          setError(
            "Unable to load project."
          );
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

  // =======================================================
  // HERO STATE
  // =======================================================

  const [
    currentVideoIndex,
    setCurrentVideoIndex,
  ] = useState(0);

  const [
    nextVideoIndex,
    setNextVideoIndex,
  ] = useState(null);

  const [
    isTransitioning,
    setIsTransitioning,
  ] = useState(false);

  // =======================================================
  // HERO VIDEOS
  // =======================================================

  const heroVideos =
    Array.isArray(project?.heroVideos)
      ? project.heroVideos
          .map((video) => ({
            ...video,
            src: getMediaUrl(video),
          }))
          .filter((video) => video.src)
      : [];

  const totalVideos =
    heroVideos.length;

  const activeSrc =
    heroVideos[
      currentVideoIndex
    ]?.src || null;

  const nextSrc =
    nextVideoIndex !== null
      ? heroVideos[
          nextVideoIndex
        ]?.src || null
      : null;

  // =======================================================
  // GALLERY REF
  // =======================================================

  const galleryRef =
    useRef(null);

  // =======================================================
  // RESET HERO INDEX WHEN PROJECT CHANGES
  // =======================================================

  useEffect(() => {
    setCurrentVideoIndex(0);
    setNextVideoIndex(null);
    setIsTransitioning(false);
  }, [project]);

  // =======================================================
  // NEXT HERO VIDEO
  // =======================================================

  const handleNext = () => {
    if (isTransitioning) {
      return;
    }

    if (totalVideos <= 1) {
      return;
    }

    const nextIndex =
      currentVideoIndex + 1 >= totalVideos
        ? 0
        : currentVideoIndex + 1;

    setNextVideoIndex(nextIndex);
    setIsTransitioning(true);
  };

  // =======================================================
  // HERO TRANSITION COMPLETE
  // =======================================================

  const handleTransitionComplete = () => {
    if (nextVideoIndex === null) {
      return;
    }

    setCurrentVideoIndex(
      nextVideoIndex
    );

    setNextVideoIndex(null);
    setIsTransitioning(false);
  };

  // =======================================================
  // LENIS
  // =======================================================

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,

      easing: (t) =>
        Math.min(
          1,
          1.001 -
            Math.pow(
              2,
              -10 * t
            )
        ),

      smoothWheel: true,

      touchMultiplier: 2,
    });

    let frameId;

    function raf(time) {
      lenis.raf(time);

      frameId =
        requestAnimationFrame(raf);
    }

    frameId =
      requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  // =======================================================
  // GALLERY REVEAL
  // =======================================================

  useEffect(() => {
    if (
      !project ||
      !galleryRef.current
    ) {
      return;
    }

    const ctx = gsap.context(
      () => {
        const tiles =
          gsap.utils.toArray(
            ".gallery-tile"
          );

        if (!tiles.length) {
          return;
        }

        gsap.set(tiles, {
          clipPath:
            "inset(50% 50% 50% 50%)",
        });

        ScrollTrigger.batch(
          tiles,
          {
            start: "top 85%",

            once: true,

            onEnter: (batch) => {
              gsap.to(batch, {
                clipPath:
                  "inset(0% 0% 0% 0%)",

                duration: 1.1,

                ease:
                  "power4.inOut",

                stagger: 0.1,
              });
            },
          }
        );
      },
      galleryRef
    );

    return () => {
      ctx.revert();
    };
  }, [project]);

  // =======================================================
  // LOADING
  // =======================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-geist-mono text-sm uppercase tracking-widest">
          Loading project
        </p>
      </main>
    );
  }

  // =======================================================
  // NOT FOUND
  // =======================================================

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

  // =======================================================
  // GALLERY
  // =======================================================

  const gallery =
    Array.isArray(project.gallery)
      ? project.gallery
          .map((item) => ({
            ...item,
            src: getMediaUrl(item),
          }))
          .filter((item) => item.src)
      : [];

  // =======================================================
  // SERVICES
  // =======================================================

  const services =
    Array.isArray(project.services)
      ? project.services.filter(
          (service) =>
            typeof service === "string" &&
            service.trim().length > 0
        )
      : [];

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main className="min-h-dvh bg-black text-zinc-300 font-geist-mono selection:bg-white selection:text-black">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative w-full h-dvh overflow-hidden flex flex-col bg-black justify-between p-4">

        {/* NAVIGATION */}

        <div className="relative z-20">
          <Navigation />
        </div>

        {/* HERO VIDEO */}

        {activeSrc && (
          <HeroCanvas
            activeSrc={activeSrc}
            nextSrc={nextSrc}
            isTransitioning={
              isTransitioning
            }
            onTransitionComplete={
              handleTransitionComplete
            }
          />
        )}

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 z-[1] bg-black/20 pointer-events-none" />

        {/* WORK CONTROLS */}

        <div className="relative z-20 w-full">

          <WorkControls
            client={
              project.client || ""
            }
            title={
              project.title || ""
            }
            onNext={
              handleNext
            }
            disabled={
              isTransitioning ||
              totalVideos <= 1
            }
            currentVideo={
              totalVideos > 0
                ? currentVideoIndex + 1
                : 0
            }
            totalVideos={
              totalVideos
            }
          />

        </div>

      </section>

      {/* =================================================
          PROJECT OVERVIEW
      ================================================= */}

      <section className="mx-auto py-40 p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-12 text-[11px] leading-relaxed uppercase tracking-wider text-zinc-400 bg-black font-geist-mono pt-8">

        {/* OVERVIEW */}

        <div className="md:col-span-7 space-y-4">

          <h2 className="text-white md:text-lg">
            PROJECT OVERVIEW
          </h2>

          <p className="max-w-xl text-zinc-400 text-sm font-normal leading-5">
            {project.overview ||
              "No project overview available."}
          </p>

        </div>

        {/* SERVICES */}

        <div className="md:col-span-5 space-y-4">

          <h2 className="text-white md:text-lg">
            WHAT WE DID:
          </h2>

          {services.length > 0 ? (
            <ul className="space-y-1 text-zinc-400 text-sm">

              {services.map(
                (service, index) => (
                  <li
                    key={`${service}-${index}`}
                  >
                    {service}
                  </li>
                )
              )}

            </ul>
          ) : (
            <p className="text-zinc-600 text-sm">
              —
            </p>
          )}

        </div>

        {/* DATE */}

        <div className="md:col-span-5 space-y-2 pt-6">

          <h2 className="text-white md:text-lg">
            DATE
          </h2>

          <p className="text-zinc-400 text-sm">
            {project.date || "—"}
          </p>

        </div>

      </section>

      {/* =================================================
          GALLERY
      ================================================= */}

      <section
  ref={galleryRef}
  className="mx-auto px-6 pb-32 md:px-12 pt-20 md:pt-40 bg-black"
>
  {gallery.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

      {gallery.map((item, index) => {

        const number = String(index + 1).padStart(2, "0");

        const src = item.src;

        const isVideo =
          item.mimeType?.startsWith("video/");

        return (
          <div
            key={
              item._key ||
              `gallery-${index}`
            }
            className="flex flex-col space-y-2 group"
          >

            {/* NUMBER */}

            <span className="text-[10px] text-zinc-300 font-geist-mono">
              #{number}
            </span>

            {/* MEDIA */}

            <div className="gallery-tile relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 border border-zinc-800/80">

              {isVideo ? (

                <video
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500 ease-out"
                  onError={() => {
                    console.error(
                      "Failed to load gallery video:",
                      src
                    );
                  }}
                />

              ) : (

                <img
                  src={src}
                  alt={`${project.title || "Project"} media ${index + 1}`}
                  loading={
                    index < 4
                      ? "eager"
                      : "lazy"
                  }
                  decoding="async"
                  className="w-full h-full object-cover brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500 ease-out"
                  onError={() => {
                    console.error(
                      "Failed to load gallery image:",
                      src
                    );
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