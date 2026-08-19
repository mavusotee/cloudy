"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TransitionLink({ href, children, className }) {
  const router = useRouter();

  const handleTransition = (e) => {
    e.preventDefault();

    const overlay = document.querySelector(".page-transition-overlay");
    if (!overlay) {
      router.push(href);
      return;
    }

    const tl = gsap.timeline();

    // Reset overlay state at the left edge
    gsap.set(overlay, { "--wipe": "0%", opacity: 0 });

    // 1. Sweep across to 125% to ensure 100% solid black coverage
    tl.to(overlay, {
      opacity: 1,
      "--wipe": "125%",
      duration: 0.55,
      ease: "power2.inOut",
    });

    // 2. Trigger route push once screen is completely blacked out
    tl.call(() => {
      router.push(href);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    });
  };

  return (
    <Link href={href} onClick={handleTransition} className={className}>
      {children}
    </Link>
  );
}