
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
      // This prevents the previous page's scroll position
      // from being carried into the new page.
      window.scrollTo(0, 0);

      router.push(href);

      // =====================================================
      // WAIT FOR THE NEW ROUTE
      // =====================================================

      const waitForPageReady = () => {
        if (window.location.pathname !== href) {
          requestAnimationFrame(waitForPageReady);
          return;
        }

        // ===================================================
        // WAIT FOR REACT/NEXT TO RENDER THE NEW PAGE
        // ===================================================

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // =================================================
            // WAIT FOR PAGE IMAGES TO FINISH LOADING
            // =================================================

            const images = Array.from(document.images);

            const imagePromises = images.map((img) => {
              if (img.complete) {
                return Promise.resolve();
              }

              return new Promise((resolve) => {
                img.addEventListener("load", resolve, {
                  once: true,
                });

                img.addEventListener("error", resolve, {
                  once: true,
                });
              });
            });

            Promise.all(imagePromises).then(() => {
              // Give the browser one final frame to paint
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

