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
      pointerEvents: "auto",
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
      // Reset scroll before mounting the new route.
      window.scrollTo(0, 0);

      router.push(href);

      // =====================================================
      // FAIL-SAFE TRANSITION CLEANUP
      // =====================================================

      let finished = false;

      const cleanupTransition = () => {
        if (finished) return;

        finished = true;

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
              pointerEvents: "none",
            });

            isTransitioning.current = false;

            ScrollTrigger.refresh();
          },
        });
      };

      // =====================================================
      // HARD FALLBACK
      // =====================================================
      //
      // If something goes wrong with route detection,
      // image loading, React rendering, etc., the overlay
      // can NEVER remain over the page indefinitely.
      //

      const fallbackTimer = setTimeout(() => {
        cleanupTransition();
      }, 4000);

      // =====================================================
      // WAIT FOR NEW ROUTE
      // =====================================================

      const waitForPageReady = () => {
        if (finished) return;

        if (
          window.location.pathname !==
          href
        ) {
          requestAnimationFrame(
            waitForPageReady
          );

          return;
        }

        // ===================================================
        // WAIT FOR REACT/NEXT TO RENDER
        // ===================================================

        requestAnimationFrame(() => {
          if (finished) return;

          requestAnimationFrame(() => {
            if (finished) return;

            // ===============================================
            // WAIT FOR PAGE IMAGES
            // ===============================================

            const images =
              Array.from(
                document.images
              );

            const imagePromises =
              images.map((img) => {
                if (img.complete) {
                  return Promise.resolve();
                }

                return new Promise(
                  (resolve) => {
                    img.addEventListener(
                      "load",
                      resolve,
                      {
                        once: true,
                      }
                    );

                    img.addEventListener(
                      "error",
                      resolve,
                      {
                        once: true,
                      }
                    );

                    // Individual image timeout
                    setTimeout(
                      resolve,
                      1500
                    );
                  }
                );
              });

            Promise.all(
              imagePromises
            ).then(() => {
              if (finished) return;

              // =============================================
              // GIVE THE BROWSER ONE FINAL FRAME
              // =============================================

              requestAnimationFrame(() => {
                if (finished) return;

                clearTimeout(
                  fallbackTimer
                );

                cleanupTransition();
              });
            });
          });
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