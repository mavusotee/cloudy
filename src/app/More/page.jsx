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
import Footer from "@/components/Sections/Footer";
import SmudgyTextReveal from "@/components/Animations/SmudgyTextReveal";
import SmudgyTitleReveal from "@/components/Animations/SmudgyTitleReveal";
import ServicesSection from "@/components/Sections/ServicesSection";
import ClientsSection from "@/components/Sections/ClientsSection";
import Testimonials from "@/components/Sections/Testimonials";
import BlurFlicker from "@/components/Animations/BlurFlicker";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
// 3. VIDEO DATA & HELPERS
// ----------------------------------------------------------------------
const initialVideos = [
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
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922129/woods_project_compressed_1080p_dpzyjd.mp4",
    title: "MORGAN BUILD",
    subtitle: "WOODS PROJECT",
    slug: "woods-project",
  },
  {
    id: 3,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921796/dunehouse_comp_1440p_hp8mzj.mp4",
    title: "4LIFE CONSTRUCTIONS",
    subtitle: "THE DUNE HOUSE",
    slug: "the-dune-house",
  },
  {
    id: 4,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785922167/skatepark_house_comp_1080p_v29fnm.mp4",
    title: "MORGAN BUILD",
    subtitle: "SKATEPARK HOUSE",
    slug: "skatepark-house",
  },
  {
    id: 5,
    date: "01 . 2022",
    url: "https://res.cloudinary.com/dfdzkwnb9/video/upload/v1785921778/north_adelaide_comp_1440p_exjydf.mp4",
    title: "KRIVIC",
    subtitle: "NORTH ADELAIDE",
    slug: "north-adelaide",
  },
];

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

// ----------------------------------------------------------------------
// 4. WORK CARD COMPONENT
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

    gsap.to(topL, { opacity: 0, scale: 0.9, x: -12, y: -12, duration: 0.75, ease: "power4.inOut" });
    gsap.to(topR, { opacity: 0, scale: 0.9, x: 12, y: -12, duration: 0.75, ease: "power4.inOut" });
    gsap.to(botL, { opacity: 0, scale: 0.9, x: -12, y: 12, duration: 0.75, ease: "power4.inOut" });
    gsap.to(botR, { opacity: 0, scale: 0.9, x: 12, y: 12, duration: 0.75, ease: "power4.inOut" });

    if (videoRef.current) videoRef.current.play();
  };

  return (
    <TransitionLink
      href={`/Works/${video.slug}`}
      className={`flex flex-col space-y-2 w-full block group ${containerClassName || ""}`}
    >
      <div className="flex flex-row items-center justify-between w-full px-0 md:px-2">
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
        
        {/* Corner Brackets Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div className="corner-tl absolute top-4 left-4 w-8 h-8 border-t-1 border-l-1 border-white opacity-0 scale-90 -translate-x-3 -translate-y-3 mix-blend-difference" />
          <div className="corner-tr absolute top-4 right-4 w-8 h-8 border-t-1 border-r-1 border-white opacity-0 scale-90 translate-x-3 -translate-y-3 mix-blend-difference" />
          <div className="corner-bl absolute bottom-4 left-4 w-8 h-8 border-b-1 border-l-1 border-white opacity-0 scale-90 -translate-x-3 translate-y-3 mix-blend-difference" />
          <div className="corner-br absolute bottom-4 right-4 w-8 h-8 border-b-1 border-r-1 border-white opacity-0 scale-90 translate-x-3 translate-y-3 mix-blend-difference" />
        </div>
      </div>

      <div className="flex flex-row items-baseline justify-between w-full px-0 md:px-2 pt-2 text-ghost-white">
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
// 5. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default function Page() {
  const cursorRef = useRef(null);
  const footerContainerRef = useRef(null);
  const footerRef = useRef(null);
  const overlayRef = useRef(null);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  // GSAP Custom Cursor Tracker
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const ctx = gsap.context(() => {
      gsap.set(cursor, { xPercent: -50, yPercent: -50 });

      const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

      const moveCursor = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      window.addEventListener("mousemove", moveCursor);

      return () => {
        window.removeEventListener("mousemove", moveCursor);
      };
    });

    return () => ctx.revert();
  }, []);

  // GSAP Cursor Scale State Trigger
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

  // GSAP Footer Parallax & Black Overlay Fade
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Footer Parallax Y-Shift
      gsap.fromTo(
        footerRef.current,
        { yPercent: -35 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerContainerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );

      // 2. Black Dimming Overlay Fade
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0.9 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerContainerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        }
      );
    }, footerContainerRef);

    return () => ctx.revert();
  }, []);

  const handleHoverChange = useCallback((isHovered) => {
    setIsHoveringVideo(isHovered);
  }, []);

  return (
    <div className="bg-carbon-black w-full min-h-screen py-6 px-4 md:px-6 flex flex-col space-y-16 lg:space-y-32 relative overflow-x-hidden">
      {/* CUSTOM CURSOR OVERLAY */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block scale-0 opacity-0 mix-blend-difference text-white"
      >
        <span className="font-geist-mono text-xl font-medium tracking-tight">
          [ CLICK ]
        </span>
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col space-y-16 lg:space-y-28 w-full">
        {/* NAV */}
        <div className="flex flex-row items-center justify-between w-full text-lavender">
          <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2">
            <div className="w-2 h-2 bg-ghost-white" />
            <h1>OUR IDENTITY</h1>
          </div>
          <h1 className="font-geist-mono font-medium tracking-tight text-[clamp(0.5rem,0.8vw,0.725rem)] text-ghost-white">
            [CLOUD_1]
          </h1>
        </div>

        {/* INTRO SECTION */}
        <div className="flex flex-col lg:flex-row items-start justify-between w-full text-ghost-white gap-12 lg:gap-8">
          <h1 className="font-geist-mono md:tracking-tight text-[clamp(0.55rem,1.1vw,0.875rem)] w-[43%] md:w-[13%]">
            YOU BUILT FROM THE GROUND UP. WE SHOW THE STORY FROM ABOVE.
          </h1>

          <div className="flex flex-col items-start justify-end space-y-8 lg:space-y-12 w-full md:w-[50%] lg:translate-x-[clamp(0rem,15vw,3.5rem)] font-medium">
            <SmudgyTextReveal text="The work is already high-end. The story should rise to it. We uncover the thinking, craft and details that make it worth seeing." />
            <BlurFlicker>
              <Button text="Meet Cloudhaus" href="/About" />
            </BlurFlicker>
          </div>
        </div>

        {/* HEADER & WORKS SECTION */}
        <div className="flex flex-col space-y-6 pt-14 md:pt-8 lg:pt-20">
          <div className="flex flex-row items-center justify-between w-full text-zinc-300">
            <div className="font-geist-mono font-medium tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-300" />
              <h1>SELECTED WORKS</h1>
            </div>
            <h1 className="font-geist-mono font-medium tracking-tight text-ghost-white text-[clamp(0.5rem,0.8vw,0.725rem)]">
              [CLOUD_2]
            </h1>
          </div>

          {/* WORKS HEADER ROW */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full text-ghost-white gap-4 sm:gap-0">
            <div className="flex flex-row items-start gap-4 sm:gap-6 font-monot">
              <h1 className="text-[clamp(5rem,15vw,18.875rem)] tracking-[-8%] font-light leading-none uppercase">
                Works
              </h1>
              <sup className="text-[clamp(1rem,2vw,1.875rem)] pt-1 sm:pt-6 leading-none font-sans font-medium tracking-tight">
                [
                {initialVideos.length < 10
                  ? `0${initialVideos.length}`
                  : initialVideos.length}
                ]
              </sup>
            </div>

            <div className="flex flex-col items-start sm:items-end justify-end sm:self-end w-full sm:w-auto">
              <Button text="VIEW ALL WORKS" href="/All-Works" />
            </div>
          </div>

          {/* WORKS GRID */}
          <div className="flex flex-col space-y-8 lg:space-y-58 pt-6">
            {/* ROW 1 */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-0 text-lavender">
              <WorkCard
                video={initialVideos[0]}
                heightClassName="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[30rem]"
                onHoverChange={handleHoverChange}
              />
              <WorkCard
                video={initialVideos[1]}
                heightClassName="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[30rem]"
                onHoverChange={handleHoverChange}
              />
            </div>

            {/* ROW 2 - FEATURED (FULL WIDTH) */}
            <WorkCard
              video={initialVideos[2]}
              heightClassName="w-screen left-1/2 -translate-x-1/2 h-[60vh] lg:h-screen"
              onHoverChange={handleHoverChange}
            />

            {/* ROW 3 (ASYMMETRIC GRID) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] w-full gap-12 lg:gap-20 text-lavender pb-12 lg:pb-24 items-start">
              <WorkCard
                video={initialVideos[3]}
                heightClassName="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[36rem]"
                onHoverChange={handleHoverChange}
              />
              <WorkCard
                video={initialVideos[4]}
                containerClassName="lg:translate-y-24"
                heightClassName="w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[26rem]"
                onHoverChange={handleHoverChange}
              />
            </div>
          </div>
        </div>
      </div>

      <ServicesSection />
      <ClientsSection />

      {/* PARALLAX FOOTER WRAPPER */}
      <div ref={footerContainerRef} className="relative w-full overflow-hidden">
        {/* Testimonials (Top Layer) */}
        <div className="relative z-10 bg-carbon-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)]">
          <Testimonials />
        </div>

        {/* Footer (Under Layer with Parallax Shift & Dimming Fade) */}
        <div className="relative w-full z-0 overflow-hidden">
          <div ref={footerRef} className="w-full relative will-change-transform">
            {/* Dimming Overlay Layer */}
            <div
              ref={overlayRef}
              className="absolute inset-0 bg-carbon-black pointer-events-none z-20"
            />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}