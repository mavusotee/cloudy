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
import TransitionLink from "@/components/TransitionLink";
import Button from "@/components/Button";
import SmudgyTitleReveal from "@/components/SmudgyTitleReveal";
import Lenis from "lenis";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Navigation from "@/components/Navigation";

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------
// 1. ANALOG TV NOISE SHADER MATERIAL & R3F MESH
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
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 st = vUv;
      float grain = random(st * 400.0 + vec2(uTime * 15.0, uTime * 25.0));
      float scanline = sin(st.y * 800.0) * 0.08;
      
      float r = random(st * 400.0 + vec2(uTime * 15.0 + 0.02, uTime * 25.0));
      float b = random(st * 400.0 + vec2(uTime * 15.0 - 0.02, uTime * 25.0));
      
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
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      if (opacityRef.current !== undefined) {
        materialRef.current.uniforms.uOpacity.value = opacityRef.current.value;
      }
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} ref={materialRef} attach="material" />
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
        .set(opacityRef.current, { value: 0.85 })
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
        camera={{ position: [0, 0, 1] }}
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
// 2. SMALL BUTTON COMPONENT WITH GSAP BLUR PULSE
// ----------------------------------------------------------------------
const SmallButton = forwardRef(({ isOpen }, ref) => {
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
// 3. EXPANDABLE VIDEO DATA REPOSITORY
// ----------------------------------------------------------------------
const allProjects = [
  {
    id: 1,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",
    title: "THE BUILDING COMPANY",
    subtitle: "EVERGREEN RESIDENCE",
    slug: "evergreen-residence",
  },
  {
    id: 2,
    date: "02 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",
    title: "MORGAN BUILD",
    subtitle: "WOODS PROJECT",
    slug: "woods-project",
  },
  {
    id: 3,
    date: "03 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",
    title: "4LIFE CONSTRUCTIONS",
    subtitle: "THE DUNE HOUSE",
    slug: "the-dune-house",
  },
  {
    id: 4,
    date: "04 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922167/skatepark_house_comp_1080p_v29fnm.mp4",
    title: "MORGAN BUILD",
    subtitle: "SKATEPARK HOUSE",
    slug: "skatepark-house",
  },
  {
    id: 5,
    date: "05 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921778/north_adelaide_comp_1440p_exjydf.mp4",
    title: "KRIVIC",
    subtitle: "NORTH ADELAIDE",
    slug: "north-adelaide",
  },
  {
    id: 6,
    date: "06 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",
    title: "CIRCA",
    subtitle: "ESTATE REDEVELOPMENT",
    slug: "circa-estate",
  },
  {
    id: 7,
    date: "07 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",
    title: "ORA PROJECTS",
    subtitle: "VALLEY VIEW RESIDENCE",
    slug: "ora-projects",
  },
  {
    id: 8,
    date: "08 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",
    title: "NUE BUILT",
    subtitle: "MODERN PAVILION",
    slug: "nue-built",
  },
  {
    id: 9,
    date: "09 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922167/skatepark_house_comp_1080p_v29fnm.mp4",
    title: "ARCADIA PROJECTS",
    subtitle: "CLIFFSIDE STUDIO",
    slug: "arcadia-projects",
  },
  {
    id: 10,
    date: "10 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921778/north_adelaide_comp_1440p_exjydf.mp4",
    title: "AP.DH",
    subtitle: "HARBOR HOUSE",
    slug: "ap-dh",
  },
  {
    id: 11,
    date: "11 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922206/evergreen_comp_1080p_vfkngm.mp4",
    title: "KINETIC STUDIO",
    subtitle: "GLASS PAVILION",
    slug: "glass-pavilion",
  },
  {
    id: 12,
    date: "12 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",
    title: "MODERN ARCH",
    subtitle: "DESERT RETREAT",
    slug: "desert-retreat",
  },
  {
    id: 13,
    date: "13 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",
    title: "LUMEN HOMES",
    subtitle: "COASTAL COMPLEX",
    slug: "coastal-complex",
  },
];

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// ----------------------------------------------------------------------
// 4. WORK CARD COMPONENT (GRID VIEW)
// ----------------------------------------------------------------------
function WorkCard({ video, containerClassName, heightClassName, onHoverChange }) {
  const [currentTime, setCurrentTime] = useState("00:00");
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const noiseRef = useRef(null);
  const videoRef = useRef(null);

  const handleLoadedMetadata = (e) => {
    const videoEl = e.currentTarget;
    if (videoEl && videoEl.duration) {
      videoEl.currentTime = Math.random() * videoEl.duration;
    }
  };

  const handleTimeUpdate = (e) => {
    const videoEl = e.currentTarget;
    if (videoEl) {
      setCurrentTime(formatTime(videoEl.currentTime));
    }
  };

  const handleMouseEnter = () => {
    onHoverChange(true);
    if (!containerRef.current) return;

    if (noiseRef.current?.triggerNoise) {
      noiseRef.current.triggerNoise();
    }

    const brackets = containerRef.current.querySelectorAll(
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

    if (videoRef.current) videoRef.current.pause();
    if (buttonRef.current?.triggerBlur) buttonRef.current.triggerBlur();
  };

  const handleMouseLeave = () => {
    onHoverChange(false);
    if (!containerRef.current) return;

    const topL = containerRef.current.querySelector(".corner-tl");
    const topR = containerRef.current.querySelector(".corner-tr");
    const botL = containerRef.current.querySelector(".corner-bl");
    const botR = containerRef.current.querySelector(".corner-br");

    gsap.to(topL, { opacity: 0, scale: 0.9, x: -12, y: -12, duration: 0.75, ease: "power4.inOut", overwrite: "auto" });
    gsap.to(topR, { opacity: 0, scale: 0.9, x: 12, y: -12, duration: 0.75, ease: "power4.inOut", overwrite: "auto" });
    gsap.to(botL, { opacity: 0, scale: 0.9, x: -12, y: 12, duration: 0.75, ease: "power4.inOut", overwrite: "auto" });
    gsap.to(botR, { opacity: 0, scale: 0.9, x: 12, y: 12, duration: 0.75, ease: "power4.inOut", overwrite: "auto" });

    if (videoRef.current) videoRef.current.play();
  };

  return (
    <TransitionLink
      href={`/Works/${video.slug}`}
      className={`flex flex-col space-y-2 w-full block group ${containerClassName || ""}`}
    >
      <div className="flex flex-row items-center justify-between w-full px-1">
        <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
          {video.date}
        </h1>
        <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
          {currentTime}
        </h2>
      </div>

      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden cursor-none ${heightClassName}`}
      >
        <video
          ref={videoRef}
          src={video.url}
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover brightness-90 contrast-105 transition-[filter] duration-500 ease-out group-hover:brightness-90"
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 group-hover:opacity-10" />
        <R3FTVNoise ref={noiseRef} />

        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="corner-tl absolute top-4 left-4 w-8 h-8 border-t-1 border-l-1 border-white opacity-0 scale-90 -translate-x-3 -translate-y-3 mix-blend-difference" />
          <div className="corner-tr absolute top-4 right-4 w-8 h-8 border-t-1 border-r-1 border-white opacity-0 scale-90 translate-x-3 -translate-y-3 mix-blend-difference" />
          <div className="corner-bl absolute bottom-4 left-4 w-8 h-8 border-b-1 border-l-1 border-white opacity-0 scale-90 -translate-x-3 translate-y-3 mix-blend-difference" />
          <div className="corner-br absolute bottom-4 right-4 w-8 h-8 border-b-1 border-r-1 border-white opacity-0 scale-90 translate-x-3 translate-y-3 mix-blend-difference" />
        </div>
      </div>

      <div className="flex flex-row items-baseline justify-between w-full px-1 pt-2 text-ghost-white">
        <div className="flex flex-col">
          <p className="font-geist-mono text-[clamp(0.75rem,1vw,0.575rem)] text-zinc-400 tracking-tight">
            {video.title}
          </p>
          <SmudgyTitleReveal text={video.subtitle} />
        </div>
        <SmallButton ref={buttonRef} />
      </div>
    </TransitionLink>
  );
}

// ----------------------------------------------------------------------
// 5. LIST ROW ITEM COMPONENT (DESKTOP HOVER + MOBILE SCROLLTRIGGER)
// ----------------------------------------------------------------------
function ListItemRow({ project, onHoverStart, onHoverEnd }) {
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

  // Precise Dynamic ScrollTrigger Activation on Mobile
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
        href={`/Works/${project.slug}`}
        className="relative grid grid-cols-3 items-center py-4 px-2"
      >
        <span
          ref={titleRef}
          className="font-sans text-sm md:text-xl font-light uppercase text-ghost-white inline-block"
        >
          {project.title}
        </span>
        <span
          ref={subtitleRef}
          className="font-geist-mono text-xs md:text-sm text-start uppercase tracking-wider text-zinc-400 inline-block"
        >
          {project.subtitle}
        </span>
        <span
          ref={dateRef}
          className="font-geist-mono text-sm md:text-base text-right text-zinc-500 inline-block"
        >
          {project.date}
        </span>
      </TransitionLink>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. MAIN WORKS CONTAINER COMPONENT
// ----------------------------------------------------------------------
export default function AllWorksSection() {
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const listPreviewRef = useRef(null);
  const listContainerRef = useRef(null);
  const bgVideoRef = useRef(null);

  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(13);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [displayProject, setDisplayProject] = useState(null);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  const activeProjects = useMemo(() => {
    return allProjects.slice(0, visibleCount);
  }, [visibleCount]);

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

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, allProjects.length));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [viewMode, visibleCount]);

  useEffect(() => {
    if (hoveredProject) {
      setDisplayProject(hoveredProject);
    }
  }, [hoveredProject]);

  useEffect(() => {
    if (hoveredProject && bgVideoRef.current) {
      const playPromise = bgVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [displayProject, hoveredProject]);

  // Downward Stagger Animation for List Items
  useEffect(() => {
    if (viewMode !== "list" || !listContainerRef.current) return;

    const ctx = gsap.context(() => {
      const listItems = listContainerRef.current.querySelectorAll(".list-item-row");
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

  // GSAP Cursor & List Preview Mouse Tracker
  useEffect(() => {
    const cursor = cursorRef.current;
    const preview = listPreviewRef.current;

    const ctx = gsap.context(() => {
      if (cursor) gsap.set(cursor, { xPercent: -50, yPercent: -50 });
      if (preview) {
        gsap.set(preview, {
          xPercent: -50,
          yPercent: -50,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      }

      const xToCursor = cursor ? gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" }) : null;
      const yToCursor = cursor ? gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" }) : null;

      const xToPreview = preview ? gsap.quickTo(preview, "x", { duration: 0.35, ease: "power3.out" }) : null;
      const yToPreview = preview ? gsap.quickTo(preview, "y", { duration: 0.35, ease: "power3.out" }) : null;

      const movePointer = (e) => {
        if (xToCursor && yToCursor) {
          xToCursor(e.clientX);
          yToCursor(e.clientY);
        }
        if (xToPreview && yToPreview) {
          xToPreview(e.clientX);
          yToPreview(e.clientY);
        }
      };

      window.addEventListener("mousemove", movePointer);

      return () => {
        window.removeEventListener("mousemove", movePointer);
      };
    });

    return () => ctx.revert();
  }, [viewMode]);

  // GSAP Cursor Visibility Trigger
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.to(cursor, {
      scale: isHoveringVideo ? 1 : 0,
      opacity: isHoveringVideo ? 1 : 0,
      duration: isHoveringVideo ? 0.25 : 0.2,
      ease: isHoveringVideo ? "power2.out" : "power2.in",
    });
  }, [isHoveringVideo]);

  // GSAP "PLAY VIDEO" Tag Scale & Opacity Trigger
  useEffect(() => {
    const preview = listPreviewRef.current;
    if (!preview) return;

    if (hoveredProject) {
      gsap.to(preview, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      });
    } else {
      gsap.to(preview, {
        scale: 0.85,
        opacity: 0,
        duration: 0.25,
        ease: "power3.in",
      });
    }
  }, [hoveredProject]);

  const handleHoverChange = useCallback((isHovered) => {
    setIsHoveringVideo(isHovered);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
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

  return (
    <div className="bg-carbon-black w-full min-h-screen py-6 px-4 md:py-2 md:px-4 relative overflow-x-hidden">
      {/* FULL-BLEED HOVER VIDEO BACKGROUND (LIST VIEW) */}
      <div
        className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500 ease-out ${
          hoveredProject ? "opacity-100" : "opacity-0"
        }`}
      >
        {displayProject && (
          <video
            key={displayProject.id}
            ref={bgVideoRef}
            src={displayProject.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Navigation />
      
      {/* CUSTOM CURSOR OVERLAY */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:block scale-0 opacity-0 mix-blend-difference text-white"
      >
        <span className="font-geist-mono text-xl font-medium tracking-tight">
          [ CLICK ]
        </span>
      </div>

      {/* FLOATING "PLAY VIDEO" CURSOR TAG FOR LIST VIEW */}
      <div
        ref={listPreviewRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:block scale-85 opacity-0"
      >
        <span className="font-geist-mono text-[0.65rem] tracking-widest uppercase bg-ghost-white text-carbon-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          Play Video
        </span>
      </div>

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col space-y-6 pt-14 md:pt-8 lg:pt-20">
        <div className="flex flex-row items-center justify-between w-full text-zinc-300">
          <div className=" opacity-0 font-geist-mono font-medium tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-300" />
            <h1>SELECTED WORKS</h1>
          </div>
          <h1 className="font-geist-mono font-semibold tracking-tight text-ghost-white text-[clamp(0.5rem,0.8vw,0.825rem)]">
            [CLOUD_9]
          </h1>
        </div>

        {/* WORKS HEADER ROW & VIEW TOGGLE */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full text-ghost-white gap-6 sm:gap-0 pb-6">
          <div className="flex flex-row items-start gap-4 sm:gap-6 font-monot">
            <h1 className="text-[clamp(5rem,15vw,16.875rem)] tracking-[-8%] font-light leading-none uppercase">
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
            {/* GRID / LIST TOGGLE BAR */}
            <div className="flex items-center space-x-3 font-geist-mono text-sm md:text-lg tracking-widest uppercase">
              <button
                onClick={() => handleToggleView("grid")}
                className={`transition-colors cursor-pointer ${
                  viewMode === "grid" ? "text-white font-bold" : "text-zinc-500 hover:text-white"
                }`}
              >
                GRID
              </button>
              <span className="text-zinc-600">/</span>
              <button
                onClick={() => handleToggleView("list")}
                className={`transition-colors cursor-pointer ${
                  viewMode === "list" ? "text-white font-bold" : "text-zinc-500 hover:text-white"
                }`}
              >
                LIST
              </button>
            </div>

            <Button text="VIEW ALL PROJECTS" href="/Works" />
          </div>
        </div>

        {/* DYNAMIC VIEW CONTENT CONTAINER */}
        <div ref={containerRef} className="w-full transition-all duration-300">
          {viewMode === "grid" ? (
            /* GRID LAYOUT */
            <div className="flex flex-col space-y-8 lg:space-y-14 pt-4">
              {activeProjects.length >= 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 md:gap-4 text-lavender">
                  <WorkCard
                    video={activeProjects[0]}
                    heightClassName="w-full aspect-video h-[18rem] lg:h-[24rem]"
                    onHoverChange={handleHoverChange}
                  />
                  <WorkCard
                    video={activeProjects[1]}
                    heightClassName="w-full aspect-video h-[18rem] lg:h-[28rem]"
                    onHoverChange={handleHoverChange}
                  />
                  <WorkCard
                    video={activeProjects[2]}
                    heightClassName="w-full aspect-video h-[18rem] lg:h-[24rem]"
                    onHoverChange={handleHoverChange}
                  />
                </div>
              )}

              {activeProjects.length >= 4 && (
                <div className="-mx-4 md:-mx-8 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]">
                  <WorkCard
                    video={activeProjects[3]}
                    heightClassName="w-full h-[55vh] lg:h-[97vh]"
                    onHoverChange={handleHoverChange}
                  />
                </div>
              )}

              {activeProjects.length >= 6 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-8 items-start py-2">
                  <div className="lg:col-span-5">
                    <WorkCard
                      video={activeProjects[4]}
                      heightClassName="w-full aspect-video h-[18rem] lg:h-[26rem]"
                      onHoverChange={handleHoverChange}
                    />
                  </div>
                  <div className="lg:col-span-5 lg:col-start-7 lg:translate-y-12 md:translate-x-18">
                    <WorkCard
                      video={activeProjects[5]}
                      heightClassName="w-full aspect-video h-[20rem] lg:h-[32rem]"
                      onHoverChange={handleHoverChange}
                    />
                  </div>
                </div>
              )}

              {activeProjects.length >= 8 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 text-lavender md:pt-30">
                  <WorkCard
                    video={activeProjects[6]}
                    heightClassName="w-full aspect-video h-[20rem] lg:h-[28rem]"
                    onHoverChange={handleHoverChange}
                  />
                  <WorkCard
                    video={activeProjects[7]}
                    heightClassName="w-full aspect-video h-[20rem] lg:h-[28rem]"
                    onHoverChange={handleHoverChange}
                  />
                </div>
              )}

              {activeProjects.length >= 11 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-6 md:gap-2 text-lavender md:pt-30">
                  <WorkCard
                    video={activeProjects[8]}
                    heightClassName="w-full aspect-video h-[18rem] lg:h-[24rem]"
                    onHoverChange={handleHoverChange}
                  />
                  <WorkCard
                    video={activeProjects[9]}
                    heightClassName="w-full aspect-video h-[18rem] lg:h-[24rem]"
                    onHoverChange={handleHoverChange}
                  />
                  <WorkCard
                    video={activeProjects[10]}
                    heightClassName="w-full aspect-video h-[18rem] lg:h-[24rem]"
                    onHoverChange={handleHoverChange}
                  />
                </div>
              )}

              {activeProjects.length >= 13 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 md:gap-3 text-lavender md:pt-30">
                  <WorkCard
                    video={activeProjects[11]}
                    heightClassName="w-full aspect-video h-[20rem] lg:h-[28rem]"
                    onHoverChange={handleHoverChange}
                  />
                  <WorkCard
                    video={activeProjects[12]}
                    heightClassName="w-full aspect-video h-[20rem] lg:h-[28rem]"
                    onHoverChange={handleHoverChange}
                  />
                </div>
              )}

              {activeProjects.length > 13 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {activeProjects.slice(13).map((project) => (
                    <WorkCard
                      key={project.id}
                      video={project}
                      heightClassName="w-full aspect-video h-[18rem]"
                      onHoverChange={handleHoverChange}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* LIST VIEW WITH DYNAMIC SCROLLTRIGGER HOVER ON MOBILE */
            <div ref={listContainerRef} className="relative w-full pt-8 pb-16">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-3 items-center text-zinc-500 font-geist-mono text-xs uppercase tracking-wider pb-4 border-b border-zinc-800">
                <span className="text-left">CLIENT</span>
                <span className="text-start">PROJECT</span>
                <span className="text-right">YEAR</span>
              </div>

              {/* LIST ROWS */}
              <div className="flex flex-col divide-y divide-zinc-800/60">
                {activeProjects.map((project) => (
                  <ListItemRow
                    key={project.id}
                    project={project}
                    onHoverStart={setHoveredProject}
                    onHoverEnd={() => setHoveredProject(null)}
                  />
                ))}
              </div>

              {visibleCount < allProjects.length && (
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
    </div>
  );
}