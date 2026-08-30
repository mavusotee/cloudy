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
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isTransitioning = useRef(false);

  const handleTransition = (e) => {
    e.preventDefault();

    if (isTransitioning.current) return;

    // Don't transition to the current page
    if (href === pathname) return;

    const overlay = document.querySelector(
      ".page-transition-overlay"
    );

    if (!overlay) {
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
      router.push(href);

      // =====================================================
      // WAIT FOR THE NEW ROUTE
      // =====================================================

      const checkRoute = () => {
        if (window.location.pathname !== href) {
          requestAnimationFrame(checkRoute);
          return;
        }

        // Give Next/React time to paint the new page
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // =================================================
            // WIPE OUT
            // =================================================

            gsap.to(overlay, {
              "--wipe": "0%",
              opacity: 0,
              duration: 0.75,
              ease: "power4.inOut",
              onComplete: () => {
                gsap.set(overlay, {
                  "--wipe": "0%",
                  opacity: 0,
                });

                isTransitioning.current = false;

                ScrollTrigger.refresh();
              },
            });
          });
        });
      };

      checkRoute();
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