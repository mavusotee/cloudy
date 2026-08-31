"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/UI/Navigation";
import HeroCanvas from "@/components/react-three/HeroCanvas";
import CustomVideoPlayer from "@/components/UI/CustomVideoPlayer";
import { useParams } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { client } from "@/lib/client";
import TransitionLink from "@/components/PageTransitions/TransitionLink";
import { useLayoutEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// =========================================================
// HELPERS
// =========================================================

const getMediaUrl = (media) => {
  if (!media) return null;

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
// ALL PROJECTS QUERY
// =========================================================

const ALL_PROJECTS_QUERY = `
  *[
    _type == "caseStudy" &&
    defined(slug.current)
  ]
  | order(_createdAt asc)
  {
    _id,
    title,
    "slug": slug.current
  }
`;

// =========================================================
// EXTRUDED TEXT REVEAL
// =========================================================

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function ExtrudedTextReveal({
  text,
  className = "",
  delay = 0,
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (!textRef.current || !text) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(textRef.current, {
        type: "lines,words,chars",
        linesClass:
          "sky-line relative block overflow-hidden py-[0.05em]",
        wordsClass:
          "sky-word relative inline-block whitespace-nowrap",
        charsClass:
          "sky-char relative inline-block will-change-[transform,opacity,filter] transform-gpu",
      });

      // Reveal the parent h1 (it starts hidden via inline style to
      // prevent a pre-split flash), then hide the individual chars
      // so the reveal animation controls visibility from here on.
      gsap.set(textRef.current, { opacity: 1 });

      gsap.set(split.chars, {
        opacity: 0,
        yPercent: 120,
        scaleY: 0.1,
        scaleX: 0.8,
        filter: "blur(15px)",
        transformOrigin: "50% 100%",
        force3D: true,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
        delay,
      });

      tl.to(split.chars, {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        filter: "blur(0px)",
        stagger: 0.008,
        duration: 0.8,
        force3D: true,
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [text, delay]);

  return (
    <div
      ref={containerRef}
      className={`w-[99.6%] ${className}`}
    >
      <h1 ref={textRef} className="m-0" style={{ opacity: 0 }}>
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

  // =======================================================
  // STATE
  // =======================================================

  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentVideoIndex, setCurrentVideoIndex] =
    useState(0);

  const [nextVideoIndex, setNextVideoIndex] =
    useState(null);

  const [isTransitioning, setIsTransitioning] =
    useState(false);

  const [isPlayerOpen, setIsPlayerOpen] =
    useState(false);

  // =======================================================
  // REFS
  // =======================================================

  const projectInfoRef = useRef(null);
  const heroDimmingRef = useRef(null);
  const scrollProgressRef = useRef(null);

  // =======================================================
  // FETCH PROJECT
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

        const [data, projects] = await Promise.all([
          client.fetch(
            PROJECT_QUERY,
            { slug },
            {
              next: {
                revalidate: 60,
              },
            }
          ),

          client.fetch(
            ALL_PROJECTS_QUERY,
            {},
            {
              next: {
                revalidate: 60,
              },
            }
          ),
        ]);

        if (cancelled) return;

        if (!data) {
          setProject(null);
          setAllProjects(projects || []);
          return;
        }

        setProject(data);
        setAllProjects(projects || []);
      } catch (err) {
        console.error(
          "Failed to fetch Sanity project:",
          err
        );

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

  // =======================================================
  // NEXT PROJECT
  // =======================================================

  const currentProjectIndex = useMemo(() => {
    return allProjects.findIndex(
      (item) => item.slug === slug
    );
  }, [allProjects, slug]);

  const nextProject = useMemo(() => {
    if (
      allProjects.length <= 1 ||
      currentProjectIndex === -1
    ) {
      return null;
    }

    return allProjects[
      (currentProjectIndex + 1) %
        allProjects.length
    ];
  }, [allProjects, currentProjectIndex]);

  // =======================================================
  // HERO VIDEOS
  // =======================================================

  const heroVideos = useMemo(() => {
    if (!Array.isArray(project?.heroVideos)) {
      return [];
    }

    return project.heroVideos
      .map((video) => ({
        ...video,
        src: getMediaUrl(video),
      }))
      .filter((video) => video.src);
  }, [project]);

  const totalVideos = heroVideos.length;

  const activeSrc =
    heroVideos[currentVideoIndex]?.src || null;

  const nextSrc =
    nextVideoIndex !== null
      ? heroVideos[nextVideoIndex]?.src || null
      : null;

  // =======================================================
  // PRELOAD ACTIVE HERO VIDEO
  // =======================================================

  useEffect(() => {
    if (!activeSrc) return;

    const existing = document.querySelector(
      `link[data-video-preload="${activeSrc}"]`
    );

    if (existing) return;

    const link = document.createElement("link");

    link.rel = "preload";
    link.as = "video";
    link.href = activeSrc;
    link.dataset.videoPreload = activeSrc;

    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [activeSrc]);

  // =======================================================
  // RESET VIDEO STATE WHEN PROJECT CHANGES
  // =======================================================

  useEffect(() => {
    setCurrentVideoIndex(0);
    setNextVideoIndex(null);
    setIsTransitioning(false);
    setIsPlayerOpen(false);
  }, [project]);

  // =======================================================
  // NEXT HERO VIDEO
  // =======================================================

  const handleNext = () => {
    if (
      isTransitioning ||
      totalVideos <= 1
    ) {
      return;
    }

    const nextIndex =
      currentVideoIndex + 1 >= totalVideos
        ? 0
        : currentVideoIndex + 1;

    setNextVideoIndex(nextIndex);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    if (nextVideoIndex === null) return;

    setCurrentVideoIndex(nextVideoIndex);
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
          1.001 - Math.pow(2, -10 * t)
        ),

      smoothWheel: true,
      touchMultiplier: 2,
    });

    const updateScrollProgress = ({ scroll }) => {
      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (documentHeight <= 0) {
        if (scrollProgressRef.current) {
          scrollProgressRef.current.style.transform =
            "scaleX(0)";
        }

        return;
      }

      const progress = Math.min(
        1,
        Math.max(
          0,
          scroll / documentHeight
        )
      );

      if (scrollProgressRef.current) {
        scrollProgressRef.current.style.transform =
          `scaleX(${progress})`;
      }
    };

    lenis.on(
      "scroll",
      ScrollTrigger.update
    );

    lenis.on(
      "scroll",
      updateScrollProgress
    );

    updateScrollProgress({
      scroll: lenis.scroll,
    });

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off(
        "scroll",
        ScrollTrigger.update
      );

      lenis.off(
        "scroll",
        updateScrollProgress
      );

      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // =======================================================
  // HERO DIMMING WHILE SCROLLING THROUGH PROJECT INFO
  // =======================================================

  useGSAP(
    () => {
      const section = projectInfoRef.current;
      const dimmer = heroDimmingRef.current;

      if (!section || !dimmer) return;

      gsap.set(dimmer, {
        opacity: 0,
      });

      gsap.to(dimmer, {
        opacity: 0.75,
        ease: "none",

        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "bottom 35%",
          scrub: true,
        },
      });
    },
    {
      dependencies: [project],
      revertOnUpdate: true,
    }
  );

  // =======================================================
  // LOADING
  // =======================================================

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-geist-mono text-sm uppercase tracking-widest" />
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

  const gallery = Array.isArray(project.gallery)
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

  const services = Array.isArray(project.services)
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
    <main
      className="
        relative
        isolate
        min-h-dvh
        bg-black
        text-zinc-300
        font-geist-mono
        selection:bg-white
        selection:text-black
      "
    >
      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div
        className="
          fixed
          top-0
          left-0
          w-full
          z-[100000]
          pointer-events-auto
        "
      >
        <Navigation />
      </div>

      {/* =================================================
          SCROLL PROGRESS
      ================================================= */}

      <div
        className="
          fixed
          top-0
          left-0
          w-full
          h-[2px]
          bg-white/10
          z-[9999]
          pointer-events-none
        "
        aria-hidden="true"
      >
        <div
          ref={scrollProgressRef}
          className="
            absolute
            top-0
            left-0
            h-full
            w-full
            bg-white
            origin-left
            will-change-transform
          "
          style={{
            transform: "scaleX(0)",
          }}
        />
      </div>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative w-full bg-black">
        {/* =================================================
            STICKY HERO BACKGROUND
        ================================================= */}

        <div
          className="
            absolute
            inset-0
            pointer-events-none
          "
        >
          <div
            className="
              sticky
              top-0
              h-dvh
              w-full
              overflow-hidden
            "
          >
            {/* HERO CANVAS */}

            {activeSrc && (
              <div className="absolute inset-0">
                <HeroCanvas
                  activeSrc={activeSrc}
                  nextSrc={nextSrc}
                  isTransitioning={isTransitioning}
                  onTransitionComplete={
                    handleTransitionComplete
                  }
                />
              </div>
            )}

            {/* BASE HERO OVERLAY */}

            <div
              className="
                absolute
                inset-0
                z-[1]
                bg-black/40
              "
            />

            {/* SCROLL DIMMER */}

            <div
              ref={heroDimmingRef}
              className="
                absolute
                inset-0
                z-[2]
                bg-black
              "
            />
          </div>
        </div>

        {/* =================================================
            HERO CONTENT
        ================================================= */}

        <div className="relative z-10">
          {/* =================================================
              HERO INTRO
          ================================================= */}

          <div
            className="
              h-dvh
              w-full
              flex
              flex-col
              justify-end
              p-4
              md:p-8
            "
          >
            <div
              className="
                relative
                w-full
                flex
                flex-col
                md:flex-row
                md:items-end
                md:justify-between
                gap-8
                md:gap-0
              "
            >
              {/* =================================================
                  PROJECT TITLE
              ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  font-sans
                  tracking-tighter
                  order-1
                  md:order-none

                  translate-y-6
                  md:translate-y-0
                "
              >
                <ExtrudedTextReveal
                  text={project.title || ""}
                  className="
                    text-[clamp(4.5rem,12vw,7rem)]
                    md:text-9xl
                    text-ghost-white
                    tracking-tight
                    md:tracking-[-7px]
                    leading-[90%]
                  "
                />

                {totalVideos > 1 && (
                  <span
                    className="
                      text-[10px]
                      md:text-xs
                      text-zinc-400
                      font-geist-mono
                      tracking-normal
                    "
                  >
                    {String(
                      currentVideoIndex + 1
                    ).padStart(2, "0")}{" "}
                    /{" "}
                    {String(
                      totalVideos
                    ).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* =================================================
                  MEDIA BY CLOUDHAUS
              ================================================= */}

              <div
                className="
                  md:absolute
                  md:left-1/2
                  md:bottom-0
                  md:-translate-x-[40%]
                  flex
                  justify-start
                  md:justify-center
                  items-end
                  w-full
                  md:w-auto
                  pointer-events-none
                  order-2
                  md:order-none
                "
              >
                <ExtrudedTextReveal
                  text="MEDIA BY CLOUDHAUS"
                  delay={0.15}
                  className="
                    text-left
                    md:text-center
                    font-geist-mono
                    text-[clamp(0.5rem,1.5vw,0.75rem)]
                    uppercase
                    tracking-[0px]
                    text-zinc-400
                    leading-none
                    whitespace-nowrap
                  "
                />
              </div>

              {/* =================================================
                  CONTROLS
              ================================================= */}

              <div
                className="
                  flex
                  flex-row
                  items-center
                  gap-3
                  w-full
                  md:w-auto
                  order-3
                  md:order-none
                "
              >
                {/* WATCH VIDEO */}

                {activeSrc && (
                  <button
                    type="button"
                    onClick={() =>
                      setIsPlayerOpen(true)
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      bg-black
                      border
                      border-eclipse
                      text-white
                      h-[4rem]
                      px-5
                      md:px-7
                      flex
                      shrink-0
                      items-center
                      justify-center
                      transition-colors
                      duration-300
                      hover:bg-white
                      hover:text-black
                      rounded-full
                    "
                  >
                    <span
                      className="
                        font-geist-mono
                        text-[10px]
                        md:text-xs
                        tracking-widest
                        uppercase
                        relative
                        z-10
                      "
                    >
                      Watch Video
                    </span>

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        w-full
                        h-[1px]
                        bg-white
                        scale-x-0
                        origin-left
                        transition-transform
                        duration-500
                        group-hover:scale-x-100
                      "
                    />
                  </button>
                )}

                {/* NEXT VIDEO */}

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    isTransitioning ||
                    totalVideos <= 1
                  }
                  aria-label="Next project video"
                  className={`
                    bg-black
                    border
                    border-eclipse
                    text-2xl
                    w-[3.5rem]
                    h-[4rem]
                    flex
                    shrink-0
                    items-center
                    justify-center
                    text-center
                    transition-opacity
                    duration-300
                    ${
                      isTransitioning ||
                      totalVideos <= 1
                        ? "opacity-40 cursor-not-allowed"
                        : "opacity-100 cursor-pointer"
                    }
                  `}
                >
                  <span className="text-2xl leading-none">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              PROJECT INFORMATION
          ================================================= */}

          <div
            ref={projectInfoRef}
            className="
              relative
              px-4
              md:px-8
              py-20
            "
          >
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-12
                gap-12
                md:gap-x-8
                md:gap-y-12
                text-[11px]
                leading-relaxed
                uppercase
                tracking-wider
                text-ghost-white
                font-geist-mono
              "
            >
              {/* =================================================
                  PROJECT OVERVIEW
              ================================================= */}

              <div
                className="
                  md:col-span-7
                  md:col-start-1
                  md:row-start-1
                  space-y-4
                "
              >
                <h2
                  className="
                    text-zinc-600
                    md:text-lg
                  "
                >
                  PROJECT OVERVIEW
                </h2>

                <p
                  className="
                    max-w-xl
                    text-ghost-white
                    text-sm
                    font-normal
                    leading-5
                    uppercase
                  "
                >
                  {project.overview ||
                    "NO PROJECT OVERVIEW AVAILABLE."}
                </p>
              </div>

              {/* =================================================
                  WHAT WE DID
              ================================================= */}

              <div
                className="
                  md:col-span-5
                  md:col-start-8
                  md:row-start-1
                  space-y-4
                "
              >
                <h2
                  className="
                    text-zinc-600
                    md:text-lg
                  "
                >
                  WHAT WE DID:
                </h2>

                {services.length > 0 ? (
                  <ul
                    className="
                      space-y-1
                      text-ghost-white
                      text-sm
                      uppercase
                    "
                  >
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
                  <p
                    className="
                      text-ghost-white
                      text-sm
                    "
                  >
                    —
                  </p>
                )}
              </div>

              {/* =================================================
                  CLIENT + DATE
              ================================================= */}

              <div
                className="
                  flex
                  flex-row
                  items-start
                  justify-between
                  w-full
                  md:contents
                "
              >
                {/* CLIENT */}

                <div
                  className="
                    space-y-2
                    pt-2
                    md:col-span-7
                    md:col-start-1
                    md:row-start-2
                  "
                >
                  <h2
                    className="
                      text-zinc-600
                      md:text-lg
                    "
                  >
                    CLIENT
                  </h2>

                  <p
                    className="
                      text-ghost-white
                      text-sm
                      uppercase
                    "
                  >
                    {project.client || "—"}
                  </p>
                </div>

                {/* DATE */}

                <div
                  className="
                    space-y-2
                    pt-2
                    md:col-span-5
                    md:col-start-8
                    md:row-start-2
                  "
                >
                  <h2
                    className="
                      text-zinc-600
                      md:text-lg
                    "
                  >
                    DATE
                  </h2>

                  <p
                    className="
                      text-ghost-white
                      text-sm
                      uppercase
                    "
                  >
                    {project.date || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          GALLERY
      ================================================= */}

      <section
        className="
          relative
          z-20
          w-full
          bg-black
          px-4
          md:px-8
          pt-20
          md:pt-40
          pb-20
        "
      >
        {gallery.length > 0 ? (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-4
              md:gap-6
            "
          >
            {gallery.map(
              (item, index) => {
                const src = item.src;

                const isVideo =
                  item.mimeType?.startsWith(
                    "video/"
                  );

                return (
                  <div
                    key={
                      item._key ||
                      `gallery-${index}`
                    }
                    className="
                      relative
                      w-full
                      overflow-hidden
                      bg-zinc-950
                    "
                  >
                    {isVideo ? (
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="
                          block
                          w-full
                          h-auto
                          object-cover
                          brightness-90
                          hover:brightness-100
                          transition-all
                          duration-500
                          ease-out
                        "
                        onError={() =>
                          console.error(
                            "Failed to load gallery video:",
                            src
                          )
                        }
                      />
                    ) : (
                      <Image
                        src={src}
                        alt={`${project.title || "Project"} media ${
                          index + 1
                        }`}
                        width={2000}
                        height={1400}
                        priority={index < 2}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={100}
                        className="
                          block
                          w-full
                          h-auto
                          object-cover
                          brightness-90
                          hover:brightness-100
                          transition-all
                          duration-500
                          ease-out
                        "
                        onError={() =>
                          console.error(
                            "Failed to load gallery image:",
                            src
                          )
                        }
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div
            className="
              flex
              items-center
              justify-center
              py-32
            "
          >
            <p
              className="
                font-geist-mono
                text-xs
                uppercase
                tracking-widest
                text-zinc-700
              "
            >
              No gallery media
            </p>
          </div>
        )}
      </section>

      {/* =================================================
          NEXT PROJECT
      ================================================= */}

      {nextProject && (
        <section
          className="
            relative
            z-30
            w-full
            bg-black
            border-t
            border-white/10
          "
        >
          <TransitionLink
            href={`/Work/${nextProject.slug}`}
            className="
              group
              block
              w-full
              px-4
              md:px-8
              py-24
              md:py-40
              overflow-hidden
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                mb-16
                md:mb-24
              "
            >
              <span
                className="
                  font-geist-mono
                  text-[10px]
                  md:text-xs
                  uppercase
                  tracking-[0.2em]
                  text-zinc-500
                "
              >
                Next Project
              </span>

              <span
                className="
                  font-geist-mono
                  text-[10px]
                  md:text-xs
                  uppercase
                  tracking-[0.2em]
                  text-zinc-500
                  group-hover:text-white
                  transition-colors
                  duration-500
                "
              >
                [View Project]
              </span>
            </div>

            {/* =================================================
                NEXT PROJECT TITLE

                Mobile only:
                translate-y-6 = 24px downward

                Desktop:
                translate-y-0 = original position
            ================================================= */}

            <div className="overflow-hidden">
              <h2
                className="
                  font-sans
                  text-[12vw]
                  md:text-9xl
                  leading-[115%]
                  tracking-[-0.07em]
                  text-white
                  transition-transform
                  duration-700

                  
                  md:translate-y-0
                "
              >
                {nextProject.title}
              </h2>
            </div>

            <div
              className="
                mt-16
                md:mt-24
                flex
                items-center
                justify-between
              "
            >
              <span
                className="
                  font-geist-mono
                  text-[10px]
                  md:text-xs
                  uppercase
                  tracking-widest
                  text-zinc-600
                "
              >
                Continue exploring
              </span>

              <span
                className="
                  flex
                  items-center
                  justify-center
                  w-12
                  h-12
                  md:w-16
                  md:h-16
                  border
                  border-white/30
                  text-white
                  transition-all
                  duration-500
                  group-hover:bg-white
                  group-hover:text-black
                  group-hover:border-white
                "
              >
                <span
                  className="
                    text-xl
                    md:text-2xl
                    transition-transform
                    duration-500
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </span>
            </div>
          </TransitionLink>
        </section>
      )}

      {/* =================================================
          BOTTOM CONTENT
      ================================================= */}

      <div
        className="
          flex
          flex-col-reverse
          md:flex-row
          items-start
          md:items-end
          justify-between
          font-geist-mono
          text-ghost-white
          text-[clamp(0.3rem,2.5vw,0.725rem)]
          uppercase
          w-full
          gap-[clamp(0.55rem,0.8vw,1.5rem)]
          pb-4
          px-2
          md:px-4
        "
      >
        <div
          className="
            flex
            flex-row
            md:contents
            justify-between
            w-full
            md:w-auto
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              space-y-0
              space-x-[clamp(0.5rem,4.5vw,6rem)]
            "
          >
            <h1>
              BASED IN ADELAIDE
            </h1>

            <h1>
              TERMS & CONDITIONS
            </h1>
          </div>

          <div
            className="
              flex
              flex-col
              md:flex-row
              space-y-0
              space-x-[clamp(0.5rem,4.5vw,6rem)]
            "
          >
            <h1>
              PRIVACY POLICY
            </h1>

            <Link
              href="https://www.withzane.com"
              className="font-bold"
            >
              WEBSITE BY: ZANE
            </Link>
          </div>
        </div>

        {/* BACK TO HOME */}

        <div
          className="
            flex
            flex-row
            space-x-[clamp(0.5rem,4.5vw,6rem)]
          "
        >
          <TransitionLink
            href="/"
            className="font-bold"
          >
            BACK TO HOME
          </TransitionLink>
        </div>
      </div>

      {/* =================================================
          EXTERNAL CUSTOM VIDEO PLAYER
      ================================================= */}

      <CustomVideoPlayer
        src={activeSrc}
        title={project.title}
        isOpen={isPlayerOpen}
        onClose={() =>
          setIsPlayerOpen(false)
        }
      />
    </main>
  );
}