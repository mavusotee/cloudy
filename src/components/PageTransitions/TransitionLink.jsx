"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

export default function TransitionLink({
  href,
  children,
  className,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isTransitioning = useRef(false);
  const targetPath = useRef(null);

  // =========================================================
  // REVEAL WHEN NEW ROUTE HAS ARRIVED
  // =========================================================

  useEffect(() => {
    if (!isTransitioning.current) return;
    if (!targetPath.current) return;

    // Wait until pathname matches the route we navigated to
    if (pathname !== targetPath.current) return;

    const overlay = document.querySelector(
      ".page-transition-overlay"
    );

    if (!overlay) {
      isTransitioning.current = false;
      targetPath.current = null;
      return;
    }

    // Give React/Next a moment to render the new page
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.to(overlay, {
          "--wipe": "0%",
          opacity: 0,
          duration: 0.75,
          ease: "power4.inOut",
          onComplete: () => {
            isTransitioning.current = false;
            targetPath.current = null;

            ScrollTrigger.refresh();
          },
        });
      });
    });
  }, [pathname]);

  // =========================================================
  // START TRANSITION
  // =========================================================

  const handleTransition = (e) => {
    e.preventDefault();

    if (isTransitioning.current) return;

    const overlay = document.querySelector(
      ".page-transition-overlay"
    );

    // If overlay doesn't exist, just navigate normally
    if (!overlay) {
      router.push(href);
      return;
    }

    // Don't transition to the page we're already on
    if (href === pathname) return;

    isTransitioning.current = true;
    targetPath.current = href;

    // Reset overlay
    gsap.set(overlay, {
      "--wipe": "0%",
      opacity: 0,
    });

    const tl = gsap.timeline();

    // =======================================================
    // 1. COVER SCREEN
    // =======================================================

    tl.to(overlay, {
      opacity: 1,
      "--wipe": "125%",
      duration: 0.75,
      ease: "power4.inOut",
    });

    // =======================================================
    // 2. NAVIGATE
    // =======================================================

    tl.call(() => {
      router.push(href);
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