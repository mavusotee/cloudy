
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

import TransitionLink from "@/components/PageTransitions/TransitionLink";
import Button from "@/components/UI/Button";
import SmudgyTitleReveal from "@/components/Animations/SmudgyTitleReveal";
import Lenis from "lenis";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import Footer from "@/components/Sections/Footer";
import Navigation from "@/components/UI/Navigation";
import { client } from "@/lib/client";

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------
// SANITY QUERY
// ----------------------------------------------------------------------

const WORKS_QUERY = `
  *[
    _type == "caseStudy"
    && defined(slug.current)
  ]
  | order(_createdAt asc)
  {
    _id,
    title,
    client,
    date,
    "slug": slug.current,

    heroVideos[] {
      _key,
      "src": asset->url
    }
  }
`;

// ----------------------------------------------------------------------
// 1. ANALOG TV NOISE SHADER
// ----------------------------------------------------------------------

const noiseShaderDefinition = {
  uniforms: {
    uTime: { value: 0 },
    uOpacity: { value: 0 },
  },

  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform float uOpacity;

    varying vec2 vUv;

    float random(vec2 st) {
      return fract(
        sin(dot(st.xy, vec2(12.9898, 78.233)))
        * 43758.5453123
      );
    }

    void main() {
      vec2 st = vUv;

      float grain = random(
        st * 400.0
        + vec2(uTime * 15.0, uTime * 25.0)
      );

      float scanline = sin(st.y * 800.0) * 0.08;

      float r = random(
        st * 400.0
        + vec2(uTime * 15.0 + 0.02, uTime * 25.0)
      );

      float b = random(
        st * 400.0
        + vec2(uTime * 15.0 - 0.02, uTime * 25.0)
      );

      vec3 color = vec3(r, grain, b) - scanline;

      gl_FragColor = vec4(color, uOpacity);
    }
  `,
};

function TVNoisePlane({ opacityRef }) {
  const materialRef = useRef(null);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
        },

        vertexShader: noiseShaderDefinition.vertexShader,
        fragmentShader: noiseShaderDefinition.fragmentShader,

        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value += delta;

    if (opacityRef.current !== undefined) {
      materialRef.current.uniforms.uOpacity.value =
        opacityRef.current.value;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />

      <primitive
        object={material}
        ref={materialRef}
        attach="material"
      />
    </mesh>
  );
}

const R3FTVNoise = forwardRef((props, ref) => {
  const opacityRef = useRef({ value: 0 });

  useImperativeHandle(ref, () => ({
    triggerNoise: () => {
      gsap.killTweensOf(opacityRef.current);

      gsap
        .timeline()
        .set(opacityRef.current, {
          value: 0.85,
        })
        .to(opacityRef.current, {
          value: 0,
          duration: 0.32,
          ease: "power3.out",
        });
    },
  }));

  return (
    <div className="absolute inset-0 pointer-events-none mix-blend-screen z-20 overflow-hidden">
      <Canvas
        camera={{
          position: [0, 0, 1],
        }}
        gl={{
          preserveDrawingBuffer: true,
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        }}
        className="w-full h-full pointer-events-none"
      >
        <TVNoisePlane opacityRef={opacityRef} />
      </Canvas>
    </div>
  );
});

R3FTVNoise.displayName = "R3FTVNoise";

// ----------------------------------------------------------------------
// 2. SMALL BUTTON
// ----------------------------------------------------------------------

const SmallButton = forwardRef(({ isOpen = false }, ref) => {
  const buttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    triggerBlur: () => {
      if (!buttonRef.current) return;

      gsap.killTweensOf(buttonRef.current);

      gsap.fromTo(
        buttonRef.current,
        {
          filter: "blur(22px) brightness(1.5)",
          scale: 0.92,
          opacity: 0.5,
        },
        {
          filter: "blur(0px) brightness(1)",
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: "back.out(1.7)",
        }
      );
    },
  }));

  return (
    <div
      ref={buttonRef}
      className={`font-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] border transition-colors duration-300 rounded-full w-[clamp(7.5rem,10vw,8.6875rem)] h-[clamp(1.75rem,2.5vw,2rem)] px-3 py-1 flex items-center justify-center text-center cursor-pointer select-none ${
        isOpen
          ? "bg-ghost-white text-carbon-black border-ghost-white hover:bg-zinc-300"
          : "bg-carbon-black text-ghost-white border-eclipse hover:bg-ghost-white hover:text-carbon-black hover:border-ghost-white"
      }`}
    >
      {isOpen ? "CLOSE" : "CLICK TO VIEW"}
    </div>
  );
});

SmallButton.displayName = "SmallButton";

// ----------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------

const getVideoUrl = (video) => {
  if (!video) return null;

  if (typeof video === "string") {
    return video;
  }

  return video.src || video.url || video.secure_url || null;
};

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins < 10 ? "0" : ""}${mins}:${
    secs < 10 ? "0" : ""
  }${secs}`;
};

// ----------------------------------------------------------------------
// 3. WORK CARD
// ----------------------------------------------------------------------

function WorkCard({
  video,
  containerClassName,
  heightClassName,
  onHoverChange,
  fullBleedVideo = false,
}) {
  const [currentTime, setCurrentTime] = useState("00:00");

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const noiseRef = useRef(null);
  const videoRef = useRef(null);

  const videoUrl = getVideoUrl(video?.heroVideos?.[0]);

  // --------------------------------------------------
  // RANDOM VIDEO START
  // --------------------------------------------------

  const handleLoadedMetadata = (e) => {
    const videoEl = e.currentTarget;

    if (
      videoEl &&
      Number.isFinite(videoEl.duration) &&
      videoEl.duration > 0
    ) {
      videoEl.currentTime =
        Math.random() * videoEl.duration;
    }
  };

  // --------------------------------------------------
  // VIDEO TIME
  // --------------------------------------------------

  const handleTimeUpdate = (e) => {
    const videoEl = e.currentTarget;

    if (videoEl) {
      setCurrentTime(formatTime(videoEl.currentTime));
    }
  };

  // --------------------------------------------------
  // HOVER ENTER
  // --------------------------------------------------

  const handleMouseEnter = () => {
    onHoverChange(true);

    if (!containerRef.current) return;

    noiseRef.current?.triggerNoise?.();

    const brackets =
      containerRef.current.querySelectorAll(
        ".corner-tl, .corner-tr, .corner-bl, .corner-br"
      );

    gsap.to(brackets, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (videoRef.current) {
      videoRef.current.pause();
    }

    buttonRef.current?.triggerBlur?.();
  };

  // --------------------------------------------------
  // HOVER LEAVE
  // --------------------------------------------------

  const handleMouseLeave = () => {
    onHoverChange(false);

    if (!containerRef.current) return;

    const topL = containerRef.current.querySelector(".corner-tl");
    const topR = containerRef.current.querySelector(".corner-tr");
    const botL = containerRef.current.querySelector(".corner-bl");
    const botR = containerRef.current.querySelector(".corner-br");

    gsap.to(topL, {
      opacity: 0,
      scale: 0.9,
      x: -12,
      y: -12,
      duration: 0.75,
      ease: "power4.inOut",
      overwrite: "auto",
    });

    gsap.to(topR, {
      opacity: 0,
      scale: 0.9,
      x: 12,
      y: -12,
      duration: 0.75,
      ease: "power4.inOut",
      overwrite: "auto",
    });

    gsap.to(botL, {
      opacity: 0,
      scale: 0.9,
      x: -12,
      y: 12,
      duration: 0.75,
      ease: "power4.inOut",
      overwrite: "auto",
    });

    gsap.to(botR, {
      opacity: 0,
      scale: 0.9,
      x: 12,
      y: 12,
      duration: 0.75,
      ease: "power4.inOut",
      overwrite: "auto",
    });

    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  if (!video) return null;

  return (
    <TransitionLink
      href={`/Work/${video.slug}`}
      className={`flex flex-col w-full ${
        containerClassName || ""
      }`}
    >
      {/* TOP INFO */}

      <div className="flex flex-row items-center justify-between w-full px-1 pb-2">
        <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
          {video.date || "—"}
        </h1>

        <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
          {currentTime}
        </h2>
      </div>

      {/* VIDEO */}

      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden cursor-pointer ${
          fullBleedVideo
            ? "-mx-4 md:-mx-8 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]"
            : "w-full"
        } ${heightClassName || ""}`}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            className="block w-full aspect-video object-cover brightness-90 contrast-105"
          />
        ) : (
          <div className="w-full aspect-video bg-zinc-900 flex flex-col items-center justify-center gap-2">
            <span className="font-geist-mono text-xs text-zinc-500 uppercase">
              No Preview
            </span>

            <span className="font-geist-mono text-[9px] text-zinc-700 uppercase">
              No hero video
            </span>
          </div>
        )}

        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 group-hover:opacity-10" />

        {/* NOISE */}

        <R3FTVNoise ref={noiseRef} />

        {/* CORNERS */}

        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="corner-tl absolute top-4 left-4 w-8 h-8 border-t border-l border-white opacity-0 scale-90 -translate-x-3 -translate-y-3 mix-blend-difference" />

          <div className="corner-tr absolute top-4 right-4 w-8 h-8 border-t border-r border-white opacity-0 scale-90 translate-x-3 -translate-y-3 mix-blend-difference" />

          <div className="corner-bl absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white opacity-0 scale-90 -translate-x-3 translate-y-3 mix-blend-difference" />

          <div className="corner-br absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white opacity-0 scale-90 translate-x-3 translate-y-3 mix-blend-difference" />
        </div>
      </div>

      {/* BOTTOM INFO */}

      <div className="flex flex-row items-baseline justify-between w-full px-1 pt-2 text-ghost-white">
        <div className="flex flex-col min-w-0">
          <p className="font-geist-mono text-[clamp(0.6875rem,1vw,0.75rem)] text-zinc-400 tracking-tight">
            {video.client || "—"}
          </p>

          <SmudgyTitleReveal
            text={video.title || "Untitled Project"}
          />
        </div>

        <SmallButton ref={buttonRef} />
      </div>
    </TransitionLink>
  );
}

// ----------------------------------------------------------------------
// 4. LIST ITEM
// ----------------------------------------------------------------------

function ListItemRow({
  project,
  onHoverStart,
  onHoverEnd,
}) {
  const rowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const dateRef = useRef(null);

  const activateRow = useCallback(() => {
    onHoverStart(project);

    gsap.to(rowRef.current, {
      backgroundColor: "#ffffff",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(titleRef.current, {
      x: 12,
      color: "#000000",
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(subtitleRef.current, {
      x: 8,
      color: "#000000",
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(dateRef.current, {
      x: -8,
      color: "#000000",
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [onHoverStart, project]);

  const deactivateRow = useCallback(() => {
    onHoverEnd();

    gsap.to(rowRef.current, {
      backgroundColor: "transparent",
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(titleRef.current, {
      x: 0,
      color: "#f8f8f8",
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(subtitleRef.current, {
      x: 0,
      color: "#a1a1aa",
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(dateRef.current, {
      x: 0,
      color: "#71717a",
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [onHoverEnd]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)", () => {
      const st = ScrollTrigger.create({
        trigger: rowRef.current,
        start: "top 50%",
        end: "bottom 50%",

        onEnter: activateRow,
        onEnterBack: activateRow,

        onLeave: deactivateRow,
        onLeaveBack: deactivateRow,
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, [activateRow, deactivateRow]);

  return (
    <div
      ref={rowRef}
      onMouseEnter={activateRow}
      onMouseLeave={deactivateRow}
      className="list-item-row"
    >
      <TransitionLink
        href={`/Work/${project.slug}`}
        className="relative grid grid-cols-3 items-center py-4 px-2"
      >
        <span
          ref={titleRef}
          className="font-sans text-xs sm:text-sm md:text-sm font-light uppercase text-ghost-white inline-block"
        >
          {project.client}
        </span>

        <span
          ref={subtitleRef}
          className="font-geist-mono text-sm sm:text-base md:text-xl lg:text-2xl text-start uppercase tracking-wide text-zinc-400 inline-block truncate pr-4"
        >
          {project.title}
        </span>

        <span
          ref={dateRef}
          className="font-geist-mono text-xs sm:text-sm md:text-base text-right text-zinc-500 inline-block"
        >
          {project.date}
        </span>
      </TransitionLink>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. MAIN WORKS
// ----------------------------------------------------------------------

export default function AllWorksSection() {
  const containerRef = useRef(null);
  const listPreviewRef = useRef(null);
  const listContainerRef = useRef(null);
  const bgVideoRef = useRef(null);

  const [viewMode, setViewMode] = useState("grid");

  const [visibleCount, setVisibleCount] = useState(13);

  const [projects, setProjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [hoveredProject, setHoveredProject] = useState(null);

  const [displayProject, setDisplayProject] = useState(null);

  // --------------------------------------------------
  // FETCH PROJECTS
  // --------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        setIsLoading(true);

        const data = await client.fetch(
          WORKS_QUERY,
          {},
          {
            next: {
              revalidate: 60,
            },
          }
        );

        console.log("SANITY WORKS:", data);

        if (!cancelled) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(
          "Failed to fetch Sanity projects:",
          error
        );

        if (!cancelled) {
          setProjects([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  // --------------------------------------------------
  // VISIBLE PROJECTS
  // --------------------------------------------------

  const activeProjects = useMemo(() => {
    return projects.slice(0, visibleCount);
  }, [projects, visibleCount]);

  // --------------------------------------------------
  // VIEW TOGGLE
  // --------------------------------------------------

  const handleToggleView = (mode) => {
    if (mode === viewMode) return;

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.25,
        ease: "power2.in",

        onComplete: () => {
          setViewMode(mode);

          gsap.to(containerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          });
        },
      });
    } else {
      setViewMode(mode);
    }
  };

  // --------------------------------------------------
  // LOAD MORE
  // --------------------------------------------------

  const handleLoadMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 5, projects.length)
    );
  };

  // --------------------------------------------------
  // REFRESH SCROLLTRIGGER
  // --------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [viewMode, visibleCount, activeProjects]);

  // --------------------------------------------------
  // HOVERED PROJECT
  // --------------------------------------------------

  useEffect(() => {
    if (hoveredProject) {
      setDisplayProject(hoveredProject);
    }
  }, [hoveredProject]);

  // --------------------------------------------------
  // PLAY BACKGROUND VIDEO
  // --------------------------------------------------

  useEffect(() => {
    if (hoveredProject && bgVideoRef.current) {
      const playPromise = bgVideoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [displayProject, hoveredProject]);

  // --------------------------------------------------
  // LIST STAGGER
  // --------------------------------------------------

  useEffect(() => {
    if (
      viewMode !== "list" ||
      !listContainerRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const listItems =
        listContainerRef.current.querySelectorAll(
          ".list-item-row"
        );

      gsap.fromTo(
        listItems,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",

          scrollTrigger: {
            trigger: listContainerRef.current,
            start: "top 85%",
            toggleActions: "play none none reset",
          },
        }
      );
    }, listContainerRef);

    return () => ctx.revert();
  }, [viewMode, activeProjects]);

  // --------------------------------------------------
  // PREVIEW TAG
  // --------------------------------------------------

  useEffect(() => {
    const preview = listPreviewRef.current;

    if (!preview) return;

    gsap.to(preview, {
      scale: hoveredProject ? 1 : 0.85,

      opacity: hoveredProject ? 1 : 0,

      duration: hoveredProject ? 0.35 : 0.25,

      ease: hoveredProject
        ? "power3.out"
        : "power3.in",
    });
  }, [hoveredProject]);

  // --------------------------------------------------
  // LENIS
  // --------------------------------------------------

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,

      easing: (t) =>
        Math.min(
          1,
          1.001 - Math.pow(2, -10 * t)
        ),

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

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="bg-black w-full min-h-screen flex items-center justify-center">
        <span className="font-geist-mono text-xs text-zinc-500 uppercase tracking-widest">
          Loading Works
        </span>
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="bg-black w-full min-h-screen px-4 py-6 md:px-4 md:pt-22 relative overflow-x-hidden">

      {/* --------------------------------------------------
          BACKGROUND VIDEO
      -------------------------------------------------- */}

      <div
        className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500 ease-out ${
          hoveredProject
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        {displayProject && (
          <>
            {getVideoUrl(
              displayProject.heroVideos?.[0]
            ) && (
              <video
                key={displayProject._id}
                ref={bgVideoRef}
                src={getVideoUrl(
                  displayProject.heroVideos?.[0]
                )}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </>
        )}

        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* --------------------------------------------------
          NAVIGATION
      -------------------------------------------------- */}

      <Navigation />

      {/* --------------------------------------------------
          PLAY VIDEO TAG
      -------------------------------------------------- */}

      <div
        ref={listPreviewRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:block scale-85 opacity-0"
      >
        <span className="font-geist-mono text-[0.65rem] tracking-widest uppercase bg-ghost-white text-carbon-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          Play Video
        </span>
      </div>

      {/* --------------------------------------------------
          HEADER
      -------------------------------------------------- */}

      <div className="relative z-10 flex flex-col space-y-6 pt-14 md:pt-8 lg:pt-20">

        <div className="flex flex-row items-center justify-between w-full text-zinc-300">

          <div className="opacity-0 font-geist-mono font-medium tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-300" />

            <h1>
              SELECTED WORKS
            </h1>
          </div>

          <h1 className="font-geist-mono font-semibold tracking-tight text-ghost-white text-[clamp(0.5rem,0.8vw,0.825rem)]">
            [CLOUD_9]
          </h1>

        </div>

        {/* --------------------------------------------------
            TITLE / CONTROLS
        -------------------------------------------------- */}

        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full text-ghost-white gap-6 sm:gap-0 pb-6">

          <div className="flex flex-row items-start gap-4 sm:gap-6">

            <h1 className="text-[clamp(5rem,15vw,16.875rem)] tracking-[-8%]  font-monot leading-none uppercase">
              Works
            </h1>

            <sup className="text-[clamp(1rem,2vw,1.875rem)] pt-1 sm:pt-6 leading-none font-sans font-medium tracking-tight">
              [
              {activeProjects.length < 10
                ? `0${activeProjects.length}`
                : activeProjects.length}
              ]
            </sup>

          </div>

          <div className="flex flex-col items-start sm:items-end justify-end space-y-4 w-full sm:w-auto">

            <div className="flex items-center space-x-3 font-geist-mono text-sm md:text-lg tracking-widest uppercase">

              <button
                onClick={() =>
                  handleToggleView("grid")
                }
                className={`transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "text-white font-bold"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                GRID
              </button>

              <span className="text-zinc-600">
                /
              </span>

              <button
                onClick={() =>
                  handleToggleView("list")
                }
                className={`transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "text-white font-bold"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                LIST
              </button>

            </div>

            
          </div>

        </div>

        {/* --------------------------------------------------
            CONTENT
        -------------------------------------------------- */}

        <div
          ref={containerRef}
          className="w-full transition-all duration-300"
        >

          {viewMode === "grid" ? (

            <div className="flex flex-col space-y-8 lg:space-y-14 pt-4">

              {/* ------------------------------------------------
                  FIRST 3 PROJECTS
                  ZERO GAP BETWEEN VIDEOS
              ------------------------------------------------ */}

              {activeProjects.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-0 text-lavender">

                  {activeProjects
                    .slice(0, 3)
                    .map((project) => (
                      <WorkCard
                        key={project._id}
                        video={project}
                        heightClassName="w-full aspect-video"
                        onHoverChange={
                          () => {}
                        }
                      />
                    ))}

                </div>
              )}

              {/* ------------------------------------------------
                  FOURTH PROJECT
                  VIDEO BLEEDS EDGE TO EDGE
                  METADATA STAYS INSIDE CONTAINER
              ------------------------------------------------ */}

              {activeProjects.length >= 4 && (
                <div className="w-full">

                  <WorkCard
                    video={activeProjects[3]}
                    fullBleedVideo
                    heightClassName="w-full"
                    onHoverChange={() => {}}
                  />

                </div>
              )}

              {/* ------------------------------------------------
                  PROJECTS 5 + 6
              ------------------------------------------------ */}

              {activeProjects.length >= 5 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-8 items-start py-2">

                  <div className="lg:col-span-5">

                    <WorkCard
                      video={activeProjects[4]}
                      heightClassName="w-full aspect-video"
                      onHoverChange={() => {}}
                    />

                  </div>

                  {activeProjects.length >= 6 && (
                    <div className="lg:col-span-5 lg:col-start-7 lg:translate-y-12">

                      <WorkCard
                        video={activeProjects[5]}
                        heightClassName="w-full aspect-video"
                        onHoverChange={() => {}}
                      />

                    </div>
                  )}

                </div>
              )}

              {/* ------------------------------------------------
                  PROJECTS 7 + 8
              ------------------------------------------------ */}

              {activeProjects.length >= 7 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 text-lavender md:pt-30">

                  <WorkCard
                    video={activeProjects[6]}
                    heightClassName="w-full aspect-video"
                    onHoverChange={() => {}}
                  />

                  {activeProjects.length >= 8 && (
                    <WorkCard
                      video={activeProjects[7]}
                      heightClassName="w-full aspect-video"
                      onHoverChange={() => {}}
                    />
                  )}

                </div>
              )}

              {/* ------------------------------------------------
                  PROJECTS 9 - 11
              ------------------------------------------------ */}

              {activeProjects.length >= 9 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 md:gap-2 text-lavender md:pt-30">

                  {activeProjects
                    .slice(8, 11)
                    .map((project) => (
                      <WorkCard
                        key={project._id}
                        video={project}
                        heightClassName="w-full aspect-video"
                        onHoverChange={() => {}}
                      />
                    ))}

                </div>
              )}

              {/* ------------------------------------------------
                  PROJECTS 12 + 13
              ------------------------------------------------ */}

              {activeProjects.length >= 12 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 md:gap-3 text-lavender md:pt-30">

                  {activeProjects
                    .slice(11, 13)
                    .map((project) => (
                      <WorkCard
                        key={project._id}
                        video={project}
                        heightClassName="w-full aspect-video"
                        onHoverChange={() => {}}
                      />
                    ))}

                </div>
              )}

              {/* ------------------------------------------------
                  ANY PROJECTS AFTER 13
              ------------------------------------------------ */}

              {activeProjects.length > 13 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">

                  {activeProjects
                    .slice(13)
                    .map((project) => (
                      <WorkCard
                        key={project._id}
                        video={project}
                        heightClassName="w-full aspect-video"
                        onHoverChange={() => {}}
                      />
                    ))}

                </div>
              )}

              {/* ------------------------------------------------
                  EMPTY STATE
              ------------------------------------------------ */}

              {activeProjects.length === 0 && (
                <div className="flex items-center justify-center py-32">

                  <span className="font-geist-mono text-xs text-zinc-600 uppercase tracking-widest">
                    No projects found
                  </span>

                </div>
              )}

            </div>

          ) : (

            /* ------------------------------------------------
               LIST VIEW
            ------------------------------------------------ */

            <div
              ref={listContainerRef}
              className="relative w-full pt-8 pb-8"
            >

              <div className="grid grid-cols-3 items-center text-zinc-500 font-geist-mono text-[0.65rem] md:text-xs uppercase tracking-wider pb-4 border-b border-zinc-800">

                <span className="text-left">
                  CLIENT
                </span>

                <span className="text-start">
                  PROJECT
                </span>

                <span className="text-right">
                  YEAR
                </span>

              </div>

              <div className="flex flex-col divide-y divide-zinc-800/60">

                {activeProjects.map((project) => (
                  <ListItemRow
                    key={project._id}
                    project={project}
                    onHoverStart={setHoveredProject}
                    onHoverEnd={() =>
                      setHoveredProject(null)
                    }
                  />
                ))}

              </div>

              {visibleCount < projects.length && (
                <div className="flex justify-center pt-12">

                  <button
                    onClick={handleLoadMore}
                    className="font-geist-mono text-xs tracking-widest uppercase border border-zinc-700 text-ghost-white hover:bg-ghost-white hover:text-carbon-black px-6 py-3 rounded-full transition-colors duration-300"
                  >
                    LOAD MORE
                  </button>

                </div>
              )}

            </div>

          )}

        </div>
      </div>

      {/* --------------------------------------------------
          FOOTER
      -------------------------------------------------- */}

      <Footer />

    </div>
  );
}

