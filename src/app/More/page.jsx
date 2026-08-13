"use client";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import TransitionLink from "@/components/TransitionLink";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import SmudgyTextReveal from "@/components/SmudgyTextReveal";
import SmudgyTitleReveal from "@/components/SmudgyTitleReveal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServicesSection from "@/components/ServicesSection";
import ClientsSection from "@/components/ClientsSection";
import { ArrowLeft } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Testimonials from "@/components/Testimonials";
import BlurFlicker from "@/components/BlurFlicker";

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------
// 1. REACT THREE FIBER - ANALOG TV NOISE SHADER MESH
// ----------------------------------------------------------------------
const NoiseShaderMaterial = {
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

    // Pseudo-random noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      vec2 st = vUv;
      
      // Fine granularity TV static noise
      float grain = random(st * 400.0 + vec2(uTime * 15.0, uTime * 25.0));
      
      // CRT TV Scanlines
      float scanline = sin(st.y * 800.0) * 0.08;
      
      // Analog Chromatic Aberration (RGB Shift)
      float r = random(st * 400.0 + vec2(uTime * 15.0 + 0.02, uTime * 25.0));
      float b = random(st * 400.0 + vec2(uTime * 15.0 - 0.02, uTime * 25.0));
      
      vec3 color = vec3(r, grain, b) - scanline;
      
      gl_FragColor = vec4(color, uOpacity);
    }
  `,
};

function TVNoisePlane({ opacityRef }) {
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      if (opacityRef.current !== undefined) {
        materialRef.current.uniforms.uOpacity.value = opacityRef.current.value;
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[NoiseShaderMaterial]}
        transparent
        depthTest={false}
        depthWrite={false}
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
        gl={{ preserveDrawingBuffer: true, alpha: true, antialias: false }}
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
// 4. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default function Page() {
  const cursorRef = useRef(null);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);

  const videoContainersRef = useRef([]);
  const buttonRefs = useRef([]);
  const noiseRefs = useRef([]);

  const [timeState, setTimeState] = useState({
    1: "00:00",
    2: "00:00",
    3: "00:00",
    4: "00:00",
    5: "00:00",
  });

  const handleLoadedMetadata = (e) => {
    const video = e.currentTarget;
    if (video && video.duration) {
      video.currentTime = Math.random() * video.duration;
    }
  };

  const handleTimeUpdate = (id, e) => {
    const video = e.currentTarget;
    if (video) {
      setTimeState((prev) => ({
        ...prev,
        [id]: formatTime(video.currentTime),
      }));
    }
  };

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

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // GSAP Cursor Hover Scale
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (isHoveringVideo) {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    } else {
      gsap.to(cursor, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isHoveringVideo]);

  // Combined Master Hover Handler
  const handleContainerMouseEnter = (index, containerEl) => {
    setIsHoveringVideo(true);

    if (!containerEl) return;

    // 1. Trigger R3F WebGL Noise Shader Burst
    if (noiseRefs.current[index]?.triggerNoise) {
      noiseRefs.current[index].triggerNoise();
    }

    // 2. Corner Bracket Frame Animation
    const topL = containerEl.querySelector(".corner-tl");
    const topR = containerEl.querySelector(".corner-tr");
    const botL = containerEl.querySelector(".corner-bl");
    const botR = containerEl.querySelector(".corner-br");

    gsap.to([topL, topR, botL, botR], {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    // 3. Pause video playback
    const video = containerEl.querySelector("video");
    if (video) video.pause();

    // 4. Trigger dramatic blur pulse on SmallButton
    if (buttonRefs.current[index]?.triggerBlur) {
      buttonRefs.current[index].triggerBlur();
    }
  };

  const handleContainerMouseLeave = (index, containerEl) => {
    setIsHoveringVideo(false);

    if (!containerEl) return;

    // 1. Reverse Corner Bracket Frame
    const topL = containerEl.querySelector(".corner-tl");
    const topR = containerEl.querySelector(".corner-tr");
    const botL = containerEl.querySelector(".corner-bl");
    const botR = containerEl.querySelector(".corner-br");

    gsap.to(topL, {
      opacity: 0,
      scale: 0.9,
      x: -12,
      y: -12,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(topR, {
      opacity: 0,
      scale: 0.9,
      x: 12,
      y: -12,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(botL, {
      opacity: 0,
      scale: 0.9,
      x: -12,
      y: 12,
      duration: 0.25,
      ease: "power2.in",
    });
    gsap.to(botR, {
      opacity: 0,
      scale: 0.9,
      x: 12,
      y: 12,
      duration: 0.25,
      ease: "power2.in",
    });

    // 2. Resume video playback
    const video = containerEl.querySelector("video");
    if (video) video.play();
  };

  // Helper Renderer for Bracket Overlay
  const renderBrackets = () => (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      <div className="corner-tl absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white opacity-0 scale-90 -translate-x-3 -translate-y-3 mix-blend-difference" />
      <div className="corner-tr absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white opacity-0 scale-90 translate-x-3 -translate-y-3 mix-blend-difference" />
      <div className="corner-bl absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white opacity-0 scale-90 -translate-x-3 translate-y-3 mix-blend-difference" />
      <div className="corner-br absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white opacity-0 scale-90 translate-x-3 translate-y-3 mix-blend-difference" />
    </div>
  );

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
          <h1 className="font-geist-mono md:tracking-tight text-[clamp(0.65rem,1.1vw,0.875rem)] w-[43%] md:w-[13%] ">
            YOU BUILT FROM THE GROUND UP. WE SHOW THE STORY FROM ABOVE.
          </h1>

          <div className="flex flex-col items-start justify-end space-y-8 lg:space-y-12 w-full lg:w-[50%] lg:translate-x-[clamp(0rem,15vw,3rem)] font-medium">
            <SmudgyTextReveal text="The work is already high-end. The story should rise to it. We uncover the thinking, craft and details that make it worth seeing." />
            <BlurFlicker>
            <Button text="Meet Cloudhaus" href="/About" />
            </BlurFlicker>
          </div>
        </div>

        {/* HEADER & WORKS SECTION */}
        <div className="flex flex-col space-y-6 pt-14 md:pt-8 lg:pt-20">
          <div className="flex flex-row items-center justify-between w-full text-zinc-300">
            <div className=" font-geist-mono font-medium tracking-tight text-[clamp(0.5rem,0.8vw,0.625rem)] flex items-center gap-2">
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
              <Button text="VIEW ALL WORKS" href="/Works" />
            </div>
         
          </div>

          {/* WORKS GRID */}
          <div className="flex flex-col space-y-8 lg:space-y-58 pt-6">
            {/* ROW 1 */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 lg:gap-0 text-lavender">
              {/* VIDEO 0 */}
              <TransitionLink
                href={`/Works/${initialVideos[0].slug}`}
                className="flex flex-col space-y-2 w-full block"
              >
                <div className="flex flex-row items-center justify-between w-full px-0 md:px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
                    {initialVideos[0].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
                    {timeState[1]}
                  </h2>
                </div>
                <div
                  ref={(el) => (videoContainersRef.current[0] = el)}
                  onMouseEnter={() =>
                    handleContainerMouseEnter(0, videoContainersRef.current[0])
                  }
                  onMouseLeave={() =>
                    handleContainerMouseLeave(0, videoContainersRef.current[0])
                  }
                  className="relative w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[30rem] overflow-hidden cursor-none"
                >
                  <video
                    src={initialVideos[0].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={(e) => handleTimeUpdate(1, e)}
                    className="w-full h-full object-cover brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 hover:opacity-20" />
                  <R3FTVNoise ref={(el) => (noiseRefs.current[0] = el)} />
                  {renderBrackets()}
                </div>
                <div className="flex flex-row items-baseline justify-between w-full px-0 md:px-2 pt-2 text-ghost-white">
                  <div className="flex flex-col">
                    <p className="font-geist-mono text-[clamp(0.75rem,1vw,0.575rem)] text-zinc-400 tracking-tight">
                      {initialVideos[0].title}
                    </p>
                    <SmudgyTitleReveal text={initialVideos[0].subtitle} />
                  </div>
                  <SmallButton ref={(el) => (buttonRefs.current[0] = el)} />
                </div>
              </TransitionLink>

              {/* VIDEO 1 */}
              <TransitionLink
                href={`/Works/${initialVideos[1].slug}`}
                className="flex flex-col space-y-2 w-full block"
              >
                <div className="flex flex-row items-center justify-between w-full px-0 md:px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
                    {initialVideos[1].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
                    {timeState[2]}
                  </h2>
                </div>
                <div
                  ref={(el) => (videoContainersRef.current[1] = el)}
                  onMouseEnter={() =>
                    handleContainerMouseEnter(1, videoContainersRef.current[1])
                  }
                  onMouseLeave={() =>
                    handleContainerMouseLeave(1, videoContainersRef.current[1])
                  }
                  className="relative w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[30rem] overflow-hidden cursor-none"
                >
                  <video
                    src={initialVideos[1].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={(e) => handleTimeUpdate(2, e)}
                    className="w-full h-full object-cover brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 hover:opacity-20" />
                  <R3FTVNoise ref={(el) => (noiseRefs.current[1] = el)} />
                  {renderBrackets()}
                </div>
                <div className="flex flex-row items-baseline justify-between w-full px-0 md:px-2 pt-2 text-ghost-white">
                  <div className="flex flex-col">
                    <p className="font-geist-mono text-[clamp(0.75rem,1vw,0.575rem)] text-zinc-400 tracking-tight">
                      {initialVideos[1].title}
                    </p>
                    <SmudgyTitleReveal text={initialVideos[1].subtitle} />
                  </div>
                  <SmallButton ref={(el) => (buttonRefs.current[1] = el)} />
                </div>
              </TransitionLink>
            </div>

            {/* ROW 2 - FEATURED (FULL WIDTH) */}
            <TransitionLink
              href={`/Works/${initialVideos[2].slug}`}
              className="flex flex-col space-y-2 w-full block"
            >
              <div className="flex flex-row items-center justify-between w-full px-0 md:px-2">
                <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
                  {initialVideos[2].date}
                </h1>
                <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
                  {timeState[3]}
                </h2>
              </div>
              <div
                ref={(el) => (videoContainersRef.current[2] = el)}
                onMouseEnter={() =>
                  handleContainerMouseEnter(2, videoContainersRef.current[2])
                }
                onMouseLeave={() =>
                  handleContainerMouseLeave(2, videoContainersRef.current[2])
                }
                className="relative w-screen left-1/2 -translate-x-1/2 h-[60vh] lg:h-screen overflow-hidden cursor-none"
              >
                <video
                  src={initialVideos[2].url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={(e) => handleTimeUpdate(3, e)}
                  className="w-full h-full object-cover brightness-90 contrast-105"
                />
                <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 hover:opacity-20" />
                <R3FTVNoise ref={(el) => (noiseRefs.current[2] = el)} />
                {renderBrackets()}
              </div>
              <div className="flex flex-row items-baseline justify-between w-full px-0 md:px-2 pt-2 text-ghost-white">
                <div className="flex flex-col">
                  <p className="font-geist-mono text-[clamp(0.75rem,1vw,0.575rem)] text-zinc-400 tracking-tight">
                    {initialVideos[2].title}
                  </p>
                  <SmudgyTitleReveal text={initialVideos[2].subtitle} />
                </div>
                <SmallButton ref={(el) => (buttonRefs.current[2] = el)} />
              </div>
            </TransitionLink>

            {/* ROW 3 (ASYMMETRIC GRID) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] w-full gap-12 lg:gap-20 text-lavender pb-12 lg:pb-24 items-start">
              {/* VIDEO 3 */}
              <TransitionLink
                href={`/Works/${initialVideos[3].slug}`}
                className="flex flex-col space-y-2 w-full block"
              >
                <div className="flex flex-row items-center justify-between w-full px-0 md:px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
                    {initialVideos[3].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
                    {timeState[4]}
                  </h2>
                </div>
                <div
                  ref={(el) => (videoContainersRef.current[3] = el)}
                  onMouseEnter={() =>
                    handleContainerMouseEnter(3, videoContainersRef.current[3])
                  }
                  onMouseLeave={() =>
                    handleContainerMouseLeave(3, videoContainersRef.current[3])
                  }
                  className="relative w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[36rem] overflow-hidden cursor-none"
                >
                  <video
                    src={initialVideos[3].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={(e) => handleTimeUpdate(4, e)}
                    className="w-full h-full object-cover brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 hover:opacity-20" />
                  <R3FTVNoise ref={(el) => (noiseRefs.current[3] = el)} />
                  {renderBrackets()}
                </div>
                <div className="flex flex-row items-baseline justify-between w-full px-0 md:px-2 pt-2 text-ghost-white">
                  <div className="flex flex-col">
                    <p className="font-geist-mono text-[clamp(0.75rem,1vw,0.575rem)] text-zinc-400 tracking-tight">
                      {initialVideos[3].title}
                    </p>
                    <SmudgyTitleReveal text={initialVideos[3].subtitle} />
                  </div>
                  <SmallButton ref={(el) => (buttonRefs.current[3] = el)} />
                </div>
              </TransitionLink>

              {/* VIDEO 4 */}
              <TransitionLink
                href={`/Works/${initialVideos[4].slug}`}
                className="w-full lg:translate-y-24 flex flex-col space-y-2 block"
              >
                <div className="flex flex-row items-center justify-between w-full px-0 md:px-2">
                  <h1 className="font-geist-mono tracking-tight text-[clamp(0.6875rem,0.9vw,0.75rem)] text-zinc-500">
                    {initialVideos[4].date}
                  </h1>
                  <h2 className="font-geist-mono font-medium tracking-tight text-[clamp(0.8125rem,1.2vw,1rem)] text-zinc-500">
                    {timeState[5]}
                  </h2>
                </div>
                <div
                  ref={(el) => (videoContainersRef.current[4] = el)}
                  onMouseEnter={() =>
                    handleContainerMouseEnter(4, videoContainersRef.current[4])
                  }
                  onMouseLeave={() =>
                    handleContainerMouseLeave(4, videoContainersRef.current[4])
                  }
                  className="relative w-[calc(100%+2rem)] -mx-4 md:w-full md:mx-0 aspect-video lg:aspect-none h-[17.5rem] lg:h-[26rem] overflow-hidden cursor-none"
                >
                  <video
                    src={initialVideos[4].url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={(e) => handleTimeUpdate(5, e)}
                    className="w-full h-full object-cover brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-300 hover:opacity-20" />
                  <R3FTVNoise ref={(el) => (noiseRefs.current[4] = el)} />
                  {renderBrackets()}
                </div>
                <div className="flex flex-row items-baseline justify-between w-full px-0 md:px-2 pt-2 text-ghost-white">
                  <div className="flex flex-col">
                    <p className="font-geist-mono text-[clamp(0.75rem,1vw,0.575rem)] text-eclipse tracking-tight">
                      {initialVideos[4].title}
                    </p>
                    <SmudgyTitleReveal text={initialVideos[4].subtitle} />
                  </div>
                  <SmallButton ref={(el) => (buttonRefs.current[4] = el)} />
                </div>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>

      <ServicesSection />
      <ClientsSection />
      <Testimonials />
      <Footer />
    </div>
  );
}