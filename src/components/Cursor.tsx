import { useEffect, useState, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const followerPos = useRef({ x: 0, y: 0 });

  const [isHovered, setIsHovered] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const updateFinePointer = () => setIsFinePointer(mediaQuery.matches);

    updateFinePointer();
    mediaQuery.addEventListener("change", updateFinePointer);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .skill-card, .highlight-card, .cert-card, .exp-card, .contact-link')) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .skill-card, .highlight-card, .cert-card, .exp-card, .contact-link')) {
        setIsHovered(false);
      }
    };

    let animationFrameId: number;
    const animateFollower = () => {
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * 0.12;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * 0.12;

      if (followerRef.current) {
        followerRef.current.style.left = `${followerPos.current.x}px`;
        followerRef.current.style.top = `${followerPos.current.y}px`;
      }

      animationFrameId = requestAnimationFrame(animateFollower);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    animationFrameId = requestAnimationFrame(animateFollower);

    return () => {
      mediaQuery.removeEventListener("change", updateFinePointer);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isFinePointer) return null;

  return (
    <>
      <div 
        ref={cursorRef}
        className={`cursor ${isHovered ? "hovered" : ""}`} 
      ></div>
      <div 
        ref={followerRef}
        className={`cursor-follower ${isHovered ? "hovered" : ""}`} 
      ></div>
    </>
  );
}
