import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import BlurFlicker from "../Animations/BlurFlicker";

function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Australia/Adelaide",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setTime(new Intl.DateTimeFormat("en-AU", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[100vh] md:min-h-[80vh] flex flex-col items-start justify-between pt-[clamp(2.5rem,8vw,7.5rem)]">
      {/* TOP DIV HOUSING ALL THREE COLUMNS */}
      <div className="flex flex-col lg:flex-row justify-between w-full gap-[clamp(3rem,4vw,5rem)] md:pt-20">
        
        {/* 1. LEFT BLOCK */}
        <div className="flex flex-col items-start justify-start space-y-[clamp(1.5rem,3vw,3rem)]">
          <div className="flex flex-col space-y-[clamp(1.2rem,2vw,1.5rem)]">
            <h1 className="w-full max-w-[clamp(35rem,50vw,48.9125rem)] tracking-tight text-[clamp(1.75rem,3.5vw,3.5375rem)] font-sans font-medium text-ghost-white leading-[110%] uppercase">
              BUILT SOMETHING WORTH LOOKING UP TO? Let’s give it a story that
              rises to the occasion.
            </h1>
            <p className="w-full max-w-[clamp(20rem,40vw,36.875rem)] text-[clamp(0.8rem,1.2vw,1rem)] text-zinc-600 leading-[130%] font-geist-mono uppercase">
              You’ve put everything into building something incredible. Now,
              let’s make sure the rest of the world sees it that way.
            </p>
          </div>
          <BlurFlicker>
          <Button text="CHECK AVAILABILITY" link="/contact" className="" />
          </BlurFlicker>
        </div>

        {/* 2. MIDDLE BLOCK (NAVIGATION & ADELAIDE TELEMETRY) */}
        <div className="flex flex-col items-start justify-start space-y-[clamp(1.5rem,2vw,2.5rem)]">
          {/* NAVIGATION LINKS */}
          <div className="flex flex-col space-y-[clamp(0.75rem,2vw,1.5rem)] items-start justify-start w-full">
            <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2 text-ghost-white">
              <div className="w-2 h-2 bg-ghost-white" />
              <span className="text-zinc-500 text-[clamp(0.65rem,1.1vw,1rem)]">
                NAVIGATION
              </span>
            </div>
            <div className="flex flex-col space-y-1 font-sans text-ghost-white text-[clamp(0.625rem,4.5vw,1.025rem)] uppercase">
              <a href="#about" className="hover:opacity-70 transition-opacity">ABOUT</a>
              <a href="#services" className="hover:opacity-70 transition-opacity">SERVICES</a>
              <a href="#work" className="hover:opacity-70 transition-opacity">WORK</a>
              <a href="#testimonials" className="hover:opacity-70 transition-opacity">TESTIMONIALS</a>
            </div>
          </div>

          {/* DYNAMIC TIME & GEOGRAPHIC DATA */}
          <div className="flex flex-col space-y-[clamp(0.35rem,1vw,0.5rem)] items-start justify-start w-full pt-2 font-geist-mono uppercase">
            <div className="flex items-center gap-2 text-[clamp(0.65rem,1.1vw,1rem)] text-ghost-white">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-zinc-400 font-bold tabular-nums">
                ADL {time || "00:00:00"}
              </span>
            </div>
            <div className="text-[clamp(0.6rem,0.9vw,0.8rem)] text-zinc-600 flex flex-col space-y-0.5 tracking-tight">
              <span>34.9285° S, 138.6007° E</span>
              <span>ELEV. 50M • ACDT/ACST</span>
            </div>
          </div>
        </div>

        {/* 3. RIGHT BLOCK (CONTACT & SOCIALS) */}
        <div className="flex flex-col items-start justify-start space-y-[clamp(2.95rem,3vw,3rem)]">
          {/* CONTACT DETAILS */}
          <div className="flex flex-col space-y-[clamp(0.75rem,2vw,1.5rem)] items-start justify-start w-full">
            <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2 text-ghost-white">
              <div className="w-2 h-2 bg-ghost-white" />
              <span className="text-zinc-500 text-[clamp(0.65rem,1.1vw,1rem)]">
                CONTACT
              </span>
            </div>
            <div className="flex flex-col -space-y-2 md:space-y-0 font-sans text-ghost-white text-[clamp(0.525rem,4.5vw,1.225rem)] uppercase">
              <span>0404 104 360</span>
              <span>ADELAIDE, SOUTH AUSTRALIA</span>
              <span>info@cloudhaus.com.au</span>
            </div>
          </div>

          {/* SOCIAL DETAILS */}
          <div className="flex flex-col space-y-[clamp(0.75rem,2vw,1.5rem)]">
            <div className="flex flex-col space-y-[clamp(0.25rem,1vw,0.5rem)] items-start justify-start w-full">
              <div className="font-mono tracking-tight text-[clamp(0.625rem,1vw,0.75rem)] flex items-center gap-2 text-ghost-white">
                <div className="w-2 h-2 bg-ghost-white" />
                <span className="text-zinc-500 text-[clamp(0.65rem,1.1vw,1rem)]">
                  SOCIALS
                </span>
              </div>
              <div className="flex flex-row space-x-[clamp(1.5rem,1.5vw,1rem)] font-sans text-ghost-white text-[clamp(0.625rem,4.5vw,1.025rem)] uppercase">
                <a href="#instagram" className="hover:opacity-70 transition-opacity">INSTAGRAM</a>
                <a href="#facebook" className="hover:opacity-70 transition-opacity">FACEBOOK</a>
                <a href="#vimeo" className="hover:opacity-70 transition-opacity">VIMEO</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM CONTENT */}
      <div className="flex flex-col-reverse md:flex-row items-start md:items-end justify-between font-geist-mono text-ghost-white text-[clamp(0.3rem,2.5vw,0.725rem)] uppercase w-full gap-[clamp(0.55rem,0.8vw,1.5rem)] pt-[clamp(2.5rem,6vw,4rem)]">
        <div className="flex flex-row md:contents justify-between w-full md:w-auto">
          <div className="flex flex-col md:flex-row space-y-0 space-x-[clamp(0.5rem,4.5vw,6rem)]">
            <span>BASED IN ADELAIDE</span>
            <span>PRIVACY POLICY</span>
          </div>
          <div className="flex flex-col md:flex-row space-y-0 space-x-[clamp(0.5rem,4.5vw,6rem)]">
            <span>TERMS & CONDITIONS</span>
            <span className="font-bold">WEBSITE BY: ZANI</span>
          </div>
        </div>

        <div className="flex flex-row space-x-[clamp(0.5rem,4.5vw,6rem)]">
          <a href="#top" className="font-bold hover:opacity-70 transition-opacity">
            BACK TO HOME
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;