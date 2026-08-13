"use client";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TransitionLink({ href, children, className }) {
  const router = useRouter();

  const handleTransition = (e) => {
    e.preventDefault();

    const transTL = gsap.timeline();

    // 1. Overlay fade in
    transTL.to(".page-transition-overlay", {
      opacity: 1,
      duration: 0.3,
      ease: "power4.inOut",
    });

    // 2. PNG reveal
    transTL.fromTo(
      ".centerPNG",
      {
        opacity: 0,
        scale: 1.2,
        filter: "blur(6px)",
      },
      {
        opacity: 1,
        scale: 1.4,
        filter: "blur(0px)",
        duration: 0.2,
        ease: "power4.out",
      }
    );

    // 3. Hold
    transTL.to({}, { duration: 0.8 });

    // 4. Navigate + refresh
    transTL.call(() => {
      router.push(href);

      // ⬇️ THIS IS THE IMPORTANT PART
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100); // small delay for DOM to mount
    });
  };

  return (
    <a href={href} onClick={handleTransition} className={className}>
      {children}
    </a>
  );
}