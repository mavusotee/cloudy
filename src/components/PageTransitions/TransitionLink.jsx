"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

export default function TransitionLink({
  href,
  children,
  className,
  onClick,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isTransitioning = useRef(false);

  const handleTransition = (e) => {
    e.preventDefault();

    if (isTransitioning.current) return;

    // Run any custom click handler
    if (onClick) {
      onClick(e);
    }

    // Don't transition to the current page
    if (href === pathname) return;

    const overlay = document.querySelector(
      ".page-transition-overlay"
    );

    if (!overlay) {
      window.scrollTo(0, 0);
      router.push(href);
      return;
    }

    isTransitioning.current = true;

    // =======================================================
    // RESET OVERLAY
    // =======================================================

    gsap.killTweensOf(overlay);

    gsap.set(overlay, {
      "--wipe": "0%",
      opacity: 0,
    });

    // =======================================================
    // WIPE IN
    // =======================================================

    const tl = gsap.timeline();

    tl.to(overlay, {
      opacity: 1,
      "--wipe": "125%",
      duration: 0.75,
      ease: "power4.inOut",
    });

    // =======================================================
    // NAVIGATE
    // =======================================================

    tl.call(() => {
      window.scrollTo(0, 0);

      router.push(href);

      // =====================================================
      // WAIT FOR NEW ROUTE
      // =====================================================

      const startTime = performance.now();

      const waitForPageReady = () => {
        // ---------------------------------------------------
        // SAFETY FALLBACK
        // ---------------------------------------------------

        if (
          performance.now() - startTime >
          4000
        ) {
          finishTransition();
          return;
        }

        // ---------------------------------------------------
        // WAIT FOR ROUTE
        // ---------------------------------------------------

        if (
          window.location.pathname !==
          href
        ) {
          requestAnimationFrame(
            waitForPageReady
          );

          return;
        }

        // ---------------------------------------------------
        // WAIT FOR REACT TO RENDER
        // ---------------------------------------------------

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            finishTransition();
          });
        });
      };

      // =====================================================
      // FINISH TRANSITION
      // =====================================================

      const finishTransition = () => {
        if (!isTransitioning.current) {
          return;
        }

        gsap.killTweensOf(overlay);

        gsap.to(overlay, {
          "--wipe": "0%",
          opacity: 0,
          duration: 0.75,
          ease: "power4.inOut",
          overwrite: true,

          onComplete: () => {
            gsap.set(overlay, {
              "--wipe": "0%",
              opacity: 0,
            });

            isTransitioning.current =
              false;

            ScrollTrigger.refresh();
          },
        });
      };

      waitForPageReady();
    });
  };

  return (
    <Link
      href={href}
      onClick={handleTransition}
      className={className}
    >
      {children}
    </Link>
  );
}