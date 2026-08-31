"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/Assets/Logo/cloud.svg";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import BlurFlicker from "../Animations/BlurFlicker";
import TransitionLink from "../PageTransitions/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   NAVIGATION
========================================================= */

function Navigation({ isMuted = true, onToggleSound }) {
  /* =======================================================
     REFS
  ======================================================= */

  const navRef = useRef(null);

  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const rightActionsRef = useRef(null);

  const menuOverlayRef = useRef(null);
  const menuContentRef = useRef(null);

  const menuOpenTimelineRef = useRef(null);
  const menuCloseTimelineRef = useRef(null);

  const isUnmountingRef = useRef(false);

  /* =======================================================
     STATE
  ======================================================= */

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* =======================================================
     BODY SCROLL LOCK
  ======================================================= */

  const lockBodyScroll = useCallback(() => {
    document.body.style.overflow = "hidden";
  }, []);

  const unlockBodyScroll = useCallback(() => {
    document.body.style.overflow = "";
  }, []);

  /* =======================================================
     MOBILE MENU SETUP
  ======================================================= */

  useGSAP(
    () => {
      if (!navRef.current) return;

      const nav = navRef.current;
      const logo = logoRef.current;
      const links = linksRef.current;
      const rightActions = rightActionsRef.current;

      const overlay = menuOverlayRef.current;
      const menuContent = menuContentRef.current;

      /* =====================================================
         INITIAL NAVIGATION STATE
      ===================================================== */

      gsap.set([logo, links, rightActions], {
        opacity: 1,
        x: 0,
        y: 0,
      });

      /* =====================================================
         FOOTER NAVIGATION ANIMATION
      ===================================================== */

      const footerEl = document.querySelector("#footer");

      if (footerEl) {
        ScrollTrigger.create({
          trigger: footerEl,
          start: "top top+=200",
          end: "bottom bottom",

          onEnter: () => {
            gsap.killTweensOf([logo, links, rightActions]);

            gsap.to(links, {
              opacity: 0,
              y: -80,
              duration: 0.8,
              ease: "power2.inOut",
              overwrite: true,
            });

            gsap.to(logo, {
              opacity: 0,
              x: -80,
              duration: 0.8,
              ease: "power2.inOut",
              overwrite: true,
            });

            gsap.to(rightActions, {
              opacity: 0,
              x: 80,
              duration: 0.8,
              ease: "power2.inOut",
              overwrite: true,
            });

            gsap.set(nav, {
              pointerEvents: "none",
            });
          },

          onLeaveBack: () => {
            gsap.killTweensOf([logo, links, rightActions]);

            gsap.to([logo, links, rightActions], {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
              overwrite: true,
            });

            gsap.set(nav, {
              pointerEvents: "auto",
            });
          },
        });
      }

      /* =====================================================
         MOBILE MENU
      ===================================================== */

      if (!overlay || !menuContent) return;

      const linkItems = menuContent.querySelectorAll(".menu-link");

      /* =====================================================
         INITIAL MENU STATE
      ===================================================== */

      gsap.set(overlay, {
        display: "none",
        pointerEvents: "none",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      });

      gsap.set(linkItems, {
        yPercent: 110,
        opacity: 0,
      });

      /* =====================================================
         OPEN TIMELINE
      ===================================================== */

      const openTl = gsap.timeline({
        paused: true,

        onStart: () => {
          gsap.set(overlay, {
            display: "flex",
            pointerEvents: "auto",
          });
        },
      });

      openTl
        .set(overlay, {
          display: "flex",
          pointerEvents: "auto",
        })
        .to(overlay, {
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.75,
          ease: "power3.inOut",
        })
        .to(
          linkItems,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          },
          "-=0.45",
        );

      /* =====================================================
         CLOSE TIMELINE
      ===================================================== */

      const closeTl = gsap.timeline({
        paused: true,

        onComplete: () => {
          if (isUnmountingRef.current) return;

          gsap.set(overlay, {
            display: "none",
            pointerEvents: "none",
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          });

          gsap.set(linkItems, {
            yPercent: 110,
            xPercent: 0,
            opacity: 0,
          });

          setIsMobileMenuOpen(false);

          unlockBodyScroll();
        },
      });

      closeTl
        .to(linkItems, {
          yPercent: -110,
          xPercent: -8,
          opacity: 0,
          duration: 0.55,
          stagger: -0.04,
          ease: "power3.in",
          overwrite: true,
        })
        .to(
          overlay,
          {
            clipPath:
              "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 0.65,
            ease: "power3.inOut",
          },
          "-=0.15",
        );

      menuOpenTimelineRef.current = openTl;
      menuCloseTimelineRef.current = closeTl;
    },
    {
      scope: navRef,
      dependencies: [],
      revertOnUpdate: true,
    },
  );

  /* =======================================================
     OPEN MENU
  ======================================================= */

  const openMobileMenu = useCallback(() => {
    const openTl = menuOpenTimelineRef.current;
    const closeTl = menuCloseTimelineRef.current;

    if (!openTl || !closeTl) return;

    closeTl.pause(0);

    setIsMobileMenuOpen(true);

    lockBodyScroll();

    openTl.restart();
  }, [lockBodyScroll]);

  /* =======================================================
     CLOSE MENU
  ======================================================= */

  const closeMobileMenu = useCallback(() => {
    const openTl = menuOpenTimelineRef.current;
    const closeTl = menuCloseTimelineRef.current;

    if (!openTl || !closeTl) return;

    openTl.pause();

    closeTl.restart();
  }, []);

  /* =======================================================
     MENU TOGGLE
  ======================================================= */

  const toggleMobileMenu = useCallback(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }, [isMobileMenuOpen, closeMobileMenu, openMobileMenu]);

  /* =======================================================
     CLEANUP
  ======================================================= */

  useGSAP(
    () => {
      return () => {
        isUnmountingRef.current = true;

        menuOpenTimelineRef.current?.kill();
        menuCloseTimelineRef.current?.kill();

        menuOpenTimelineRef.current = null;
        menuCloseTimelineRef.current = null;

        unlockBodyScroll();
      };
    },
    {
      scope: navRef,
      dependencies: [],
      revertOnUpdate: true,
    },
  );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav
        ref={navRef}
        className="
          fixed
          top-0
          left-0
          flex
          flex-row
          items-center
          justify-between
          w-full
          text-ghost-white
          p-4
          md:px-6
          md:py-6
          z-[100]
        "
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div
          ref={logoRef}
          className="
            mix-blend-difference
            pointer-events-auto
            [isolation:auto]
          "
        >
          <Link href="/" className="block">
            <Image
              src={Logo}
              alt="Logo"
              width={200}
              height={60}
              priority
              className="
                w-[clamp(140px,10vw+80px,320px)]
                h-auto
              "
            />
          </Link>
        </div>

        {/* =================================================
            DESKTOP LINKS
        ================================================= */}

        <div
          ref={linksRef}
          className="
            hidden
            md:flex
            items-center
            justify-center
            space-x-4
            font-mono
            uppercase
            text-[clamp(0.75rem,0.65rem+0.35vw,1.2rem)]
            translate-x-[clamp(0px,12vw,190px)]
            pointer-events-auto
          "
        >
          <BlurFlicker>
            <TransitionLink href="/About">
              ABOUT
            </TransitionLink>
          </BlurFlicker>

          <BlurFlicker>
            <TransitionLink href="/All-Works">
              WORK
            </TransitionLink>
          </BlurFlicker>

          <BlurFlicker>
            <TransitionLink href="/Weddings">
              MORE
            </TransitionLink>
          </BlurFlicker>

          <BlurFlicker>
            <TransitionLink href="/#footer">
              CONTACT
            </TransitionLink>
          </BlurFlicker>
        </div>

        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div
          ref={rightActionsRef}
          className="
            flex
            items-center
            space-x-2
            sm:space-x-3
            pointer-events-auto
          "
        >
          {/* CHECK AVAILABILITY */}

          <BlurFlicker>
            <button
              type="button"
              className="
                hidden
                md:flex
                bg-black
                hover:bg-zinc-800
                transition-colors
                px-[clamp(16px,1vw+8px,16px)]
                py-0
                w-[clamp(155px,12vw+70px,204px)]
                h-[clamp(44px,2.5vw+20px,55px)]
                rounded-full
                border
                border-eclipse
                font-mono
                tracking-tighter
                uppercase
                text-[clamp(0.3rem,0.63rem+0.3vw,1.25rem)]
                text-center
                items-center
                justify-center
                text-ghost-white
                cursor-pointer
              "
            >
              Check availability
            </button>
          </BlurFlicker>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={
              isMobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            className="
              flex
              md:hidden
              bg-ghost-white
              hover:bg-zinc-200
              transition-colors
              px-5
              py-0
              h-[clamp(44px,2.5vw+20px,55px)]
              rounded-full
              border
              border-ghost-white
              font-mono
              tracking-tighter
              uppercase
              text-[clamp(0.75rem,0.63rem+0.3vw,1rem)]
              text-carbon-black
              items-center
              justify-center
              font-bold
              cursor-pointer
            "
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* =====================================================
          MOBILE MENU OVERLAY
      ===================================================== */}

      <div
        ref={menuOverlayRef}
        className="
          fixed
          inset-x-0
          top-0
          z-[110]
          bg-black
          flex
          flex-col
          justify-between
          text-ghost-white
          md:hidden
          h-[85vh]
          border-b
          border-eclipse
        "
        style={{
          display: "none",
          pointerEvents: "none",
        }}
      >
        {/* =================================================
            MENU HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            w-full
            p-4
          "
        >
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="relative z-[1]"
          >
            <Image
              src={Logo}
              alt="Logo"
              width={160}
              height={48}
              priority
              className="w-36 h-auto"
            />
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="
              relative
              z-[1]
              bg-ghost-white
              text-carbon-black
              px-4
              h-11
              rounded-full
              font-mono
              text-xs
              uppercase
              font-bold
              flex
              items-center
              justify-center
              cursor-pointer
            "
          >
            Close
          </button>
        </div>

        {/* =================================================
            MENU LINKS
        ================================================= */}

        <div
          ref={menuContentRef}
          className="
            flex
            flex-col
            font-sans
            text-6xl
            uppercase
            font-medium
            my-auto
            text-white
            tracking-[-6%]
            p-6
          "
        >
          <div className="overflow-hidden">
            <Link
              href="/About"
              onClick={closeMobileMenu}
              className="
                menu-link
                block
                hover:text-zinc-400
                transition-colors
                leading-none
                text-white
                cursor-pointer
              "
            >
              ABOUT
            </Link>
          </div>

          <div className="overflow-hidden mt-3">
            <Link
              href="/All-Works"
              onClick={closeMobileMenu}
              className="
                menu-link
                block
                hover:text-zinc-400
                transition-colors
                leading-none
                cursor-pointer
              "
            >
              WORK
            </Link>
          </div>

          <div className="overflow-hidden mt-3">
            <Link
              href="/Weddings"
              onClick={closeMobileMenu}
              className="
                menu-link
                block
                hover:text-zinc-400
                transition-colors
                leading-none
                cursor-pointer
              "
            >
              MORE
            </Link>
          </div>

          {/* MEDIA BY CLOUDHAUS */}

          <div
            className="
              mt-3
              ml-1
              font-geist-mono
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-zinc-600
              leading-none
              pointer-events-none
            "
          >
            MEDIA BY CLOUDHAUS
          </div>

          <div className="overflow-hidden mt-6">
            <Link
              href="/#footer"
              onClick={closeMobileMenu}
              className="
                menu-link
                block
                hover:text-zinc-400
                transition-colors
                leading-none
                cursor-pointer
              "
            >
              CONTACT
            </Link>
          </div>
        </div>

        {/* =================================================
            SOCIALS
        ================================================= */}

        <div
          className="
            pt-6
            flex
            flex-row
            items-start
            space-y-4
            p-4
          "
        >
          <div className="flex flex-col gap-1">
            <h1
              className="
                text-eclipse
                font-mono
                font-medium
                tracking-tight
                text-[clamp(0.70rem,0.65vw+0.3rem,1rem)]
              "
            >
              SOCIALS
            </h1>

            <div
              className="
                flex
                flex-row
                w-full
                items-center
                gap-4
                text-[clamp(0.65rem,0.65vw+0.3rem,1rem)]
                font-mono
                tracking-tight
                uppercase
              "
            >
              <Link
                className="hover:text-zinc-700"
                href="https://instagram.com/itsjmvisuals"
                target="_blank"
                rel="noopener noreferrer"
              >
                INSTAGRAM
              </Link>

              <Link
                className="hover:text-zinc-700"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                FACEBOOK
              </Link>

              <Link
                className="hover:text-zinc-700"
                href="https://vimeo.com/user135969253"
                target="_blank"
                rel="noopener noreferrer"
              >
                VIMEO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navigation;